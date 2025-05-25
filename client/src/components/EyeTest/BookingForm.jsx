import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

const BookingForm = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    age: '',
    phoneNumber: '',
    email: user?.email || '',
    testDate: new Date(),
    timeSlot: '',
    previousEyeTest: false,
    currentEyewear: 'None',
    specialNotes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableSlots(formData.testDate);
  }, [formData.testDate]);

  const fetchAvailableSlots = async (date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await fetch(`/api/eye-test/available-slots?date=${formattedDate}`);
      const data = await response.json();
      setAvailableSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to fetch available time slots');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Find the selected slot object
      const selectedSlot = availableSlots.find(slot => slot.value === formData.timeSlot);
      if (!selectedSlot) {
        throw new Error('Invalid time slot selected');
      }

      const response = await fetch('/api/eye-test/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timeSlot: selectedSlot.value, // Send the 24-hour format to backend
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast.success('Eye test booked successfully!');
      navigate('/dashboard/appointments');
    } catch (error) {
      toast.error(error.message || 'Failed to book eye test');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Book Free Eye Test</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Test Date</label>
            <DatePicker
              selected={formData.testDate}
              onChange={date => setFormData(prev => ({ ...prev, testDate: date }))}
              minDate={new Date()}
              className="w-full p-2 border rounded"
              dateFormat="MMMM d, yyyy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time Slot</label>
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select a time</option>
              {availableSlots.map(slot => (
                <option key={slot.value} value={slot.value}>
                  {slot.display}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Current Eyewear</label>
            <select
              name="currentEyewear"
              value={formData.currentEyewear}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="None">None</option>
              <option value="Glasses">Glasses</option>
              <option value="Contact Lenses">Contact Lenses</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="previousEyeTest"
              checked={formData.previousEyeTest}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm">Had an eye test before?</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Special Notes</label>
          <textarea
            name="specialNotes"
            value={formData.specialNotes}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24"
            placeholder="Any special requirements or concerns..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Booking...' : 'Book Eye Test'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;