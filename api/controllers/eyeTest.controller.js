import EyeTest from "../models/eyeTest.model.js";

// Helper function to format time to 12-hour format
const formatTo12Hour = (hour, minute) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

const CAPACITY_PER_SLOT = 4;

// Get available time slots for a specific date
export const getAvailableTimeSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date' });
    }
    
    // Define store hours (9 AM to 6 PM)
    const storeHours = {
      start: 11,
      end: 17,
      slotDuration: 60 // minutes
    };

    // Generate all possible time slots
    const allTimeSlots = [];
    for (let hour = storeHours.start; hour < storeHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += storeHours.slotDuration) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = formatTo12Hour(hour, minute);
        allTimeSlots.push({
          value: timeString, // Store the 24-hour format for backend
          display: displayTime // 12-hour format for display
        });
      }
    }
    console.log("allTimeSlots",allTimeSlots);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Count bookings per slot for the date
    const slotCounts = await EyeTest.aggregate([
      {
        $match: {
          testDate: { $gte: startOfDay, $lte: endOfDay },
          status: { $nin: ['Cancelled', 'No Show'] },
        },
      },
      { $group: { _id: '$timeSlot', count: { $sum: 1 } } },
    ]);

    const countsBySlot = slotCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // Backward compatible: previously we removed fully booked slots.
    // Now we return all slots with bookedCount + isFull.
    const availableSlots = allTimeSlots.map((slot) => {
      const bookedCount = countsBySlot[slot.value] || 0;
      return {
        ...slot,
        bookedCount,
        capacity: CAPACITY_PER_SLOT,
        isFull: bookedCount >= CAPACITY_PER_SLOT,
      };
    });

    res.status(200).json(availableSlots);
  } catch (error) {
    next(error);
  }
};

// Book a new eye test
export const bookEyeTest = async (req, res, next) => {
  console.log("req.body",req.body);
  try {
    console.log("req.body",req.body);
    const details = req.body.data;
    console.log('details',details);

    const requestedDate = new Date(details?.testDate);
    if (Number.isNaN(requestedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid test date' });
    }
    if (!details?.timeSlot) {
      return res.status(400).json({ message: 'Time slot is required' });
    }

    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Enforce capacity limit (max 4 per slot/day)
    const activeBookingsCount = await EyeTest.countDocuments({
      testDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot: details.timeSlot,
      status: { $nin: ['Cancelled', 'No Show'] },
    });

    if (activeBookingsCount >= CAPACITY_PER_SLOT) {
      console.log('here')
      return res.status(400).json({ message: 'This time slot is fully booked' });
    }
    console.log('here3')
    // Create new booking
    const eyeTest = await EyeTest.create({
      ...details,
      testDate: requestedDate,
    });

    res.status(201).json(eyeTest);
  } catch (error) {
    // In case an old unique index still exists in MongoDB, return a friendly message.
    if (error?.code === 11000) {
      console.log('here2')
      console.log(error)
      return res.status(400).json({ message: 'This time slot is fully booked' });
    }
    next(error);
  }
};

/*
  NOTE:
  Previously, we prevented any duplicate bookings via a unique index on (testDate, timeSlot).
  To allow up to 4 bookings per slot/day, ensure the old unique index is dropped in MongoDB:
  db.eyetests.dropIndex({ testDate: 1, timeSlot: 1 })
*/

// Get booked slots for the date (legacy code kept below for reference)
/*
    const bookedTests = await EyeTest.find({
      testDate: {
        $gte: new Date(selectedDate.setHours(0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59))
      },
      status: { $nin: ['Cancelled', 'No Show'] }
    }).select('timeSlot');

    const bookedSlots = bookedTests.map(test => test.timeSlot);
    console.log("bookedSlots",bookedSlots);

    // Filter out booked slots
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot.value));

    res.status(200).json(availableSlots);
*/

// Get all eye tests (for admin)
export const getAllEyeTests = async (req, res, next) => {
  try {
    const { status, date, startDate, endDate } = req.query;
    let query = {};


    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by date if provided
    if (date) {
      const selectedDate = new Date(date);
      query.testDate = {
        $gte: new Date(selectedDate.setHours(0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59))
      };
    }

    // Filter by date range (preferred)
    if (startDate || endDate) {
      const range = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        range.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        range.$lte = end;
      }
      query.testDate = range;
    }

    const eyeTests = await EyeTest.find(query)
      .populate('userId', 'name email')
      .sort({ testDate: -1, timeSlot: -1 });

    // Format time slots for display
    const formattedTests = eyeTests.map(test => {
      const [hour, minute] = test.timeSlot.split(':');
      const displayTime = formatTo12Hour(parseInt(hour), parseInt(minute));
      return {
        ...test.toObject(),
        displayTime
      };
    });

    res.status(200).json(formattedTests);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Get user's eye tests
export const getUserEyeTests = async (req, res, next) => {
  try {
    const eyeTests = await EyeTest.find({ userId: req.user.id })
      .sort({ testDate: -1 });

    // Format time slots for display
    const formattedTests = eyeTests.map(test => {
      const [hour, minute] = test.timeSlot.split(':');
      const displayTime = formatTo12Hour(parseInt(hour), parseInt(minute));
      return {
        ...test.toObject(),
        displayTime
      };
    });

    res.status(200).json(formattedTests);
  } catch (error) {
    next(error);
  }
};

// Update eye test status
export const updateEyeTestStatus = async (req, res, next) => {
  try {
    const { status, testResults, cancellationReason } = req.body;
    const eyeTest = await EyeTest.findById(req.params.id);

    if (!eyeTest) {
      return next(errorHandler(404, 'Eye test booking not found'));
    }

    // Update status
    eyeTest.status = status;

    // If cancelled, add reason
    if (status === 'Cancelled') {
      eyeTest.cancellationReason = cancellationReason;
    }

    // If completed, add test results
    if (status === 'Completed' && testResults) {
      eyeTest.testResults = testResults;
    }

    await eyeTest.save();

    // Format time slot for display
    const [hour, minute] = eyeTest.timeSlot.split(':');
    const displayTime = formatTo12Hour(parseInt(hour), parseInt(minute));
    const formattedTest = {
      ...eyeTest.toObject(),
      displayTime
    };

    res.status(200).json(formattedTest);
  } catch (error) {
    next(error);
  }
};

// Get eye test details
export const getEyeTestDetails = async (req, res, next) => {
  try {
    const eyeTest = await EyeTest.findById(req.params.id)
      .populate('userId', 'name email');

    if (!eyeTest) {
      return next(errorHandler(404, 'Eye test booking not found'));
    }

    // Format time slot for display
    const [hour, minute] = eyeTest.timeSlot.split(':');
    const displayTime = formatTo12Hour(parseInt(hour), parseInt(minute));
    const formattedTest = {
      ...eyeTest.toObject(),
      displayTime
    };

    res.status(200).json(formattedTest);
  } catch (error) {
    next(error);
  }
}; 