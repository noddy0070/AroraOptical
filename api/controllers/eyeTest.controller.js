import EyeTest from "../models/eyeTest.model.js";

// Helper function to format time to 12-hour format
const formatTo12Hour = (hour, minute) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    const selectedDate = new Date(date);
    
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

    // Get booked slots for the date
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
  } catch (error) {
    next(error);
  }
};

// Book a new eye test
export const bookEyeTest = async (req, res, next) => {
  try {
    const { testDate, timeSlot } = req.body;

    // Check if slot is already booked
    const existingBooking = await EyeTest.findOne({
      testDate,
      timeSlot,
      status: { $nin: ['Cancelled', 'No Show'] }
    });

    if (existingBooking) {
      return next(errorHandler(400, 'This time slot is already booked'));
    }

    // Create new booking
    const eyeTest = await EyeTest.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json(eyeTest);
  } catch (error) {
    next(error);
  }
};

// Get all eye tests (for admin)
export const getAllEyeTests = async (req, res, next) => {
  try {
    const { status, date } = req.query;
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

    const eyeTests = await EyeTest.find(query)
      .populate('userId', 'name email')
      .sort({ testDate: 1, timeSlot: 1 });

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