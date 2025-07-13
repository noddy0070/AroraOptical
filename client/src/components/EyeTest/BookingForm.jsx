import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import eyeTestBanner from '../../assets/images/eyeTestBanner.png'
import Calendar from 'react-calendar';
import axios from 'axios';
import { baseURL } from '@/url';

import './calendar.css';
const BookingForm = () => {
  const [date, setDate] = useState(new Date());
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    phoneNumber: '',
    email: user?.email || '',
    testDate: new Date(),
    timeSlot: '',
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
      const response = await fetch(`${baseURL}/api/eye-test/available-slots?date=${formattedDate}`);
      const data = await response.json();
      console.log(data);
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

      const response = await axios.post(`${baseURL}/api/eye-test/book`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          ...formData,
          timeSlot: selectedSlot.value, // Send the 24-hour format to backend
        },
        withCredentials: true,
      });

      const data = await response.data;

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
    <div className="">
      <img src={eyeTestBanner} alt="Eye Test Banner" className="w-full h-auto mb-6" />
      <div className='p-[2vw]'>
      <h2 className="text-h4Text font-semibold mb-6 text-center">Booking Details</h2>

      <div className='flex flex-row gap-[2vw] justify-center'>
      <form onSubmit={handleSubmit} className="space-y-4 w-[25vw]">

        <div className="">
          <div className='mb-[1vw]'>
            <label className="block text-regularText font-medium mb-[.5vw] ">Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-[12px]"
            />
          </div>
          <div className='mb-[1vw]'>
            <label className="block text-regularText font-medium mb-[.5vw]">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-[12px]"
            />
          </div>

          <div className='mb-[1vw]'>
            <label className="block text-regularText font-medium mb-[.5vw]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-[12px]"
            />
          </div>

          {/* <div className='mb-[1vw]'>
            <label className="block text-regularText font-medium mb-[.5vw]">Test Date</label>
            <DatePicker
              selected={formData.testDate}
              onChange={date => setFormData(prev => ({ ...prev, testDate: date }))}
              minDate={new Date()}
              className="w-full p-2 border rounded-[12px]"
              dateFormat="MMMM d, yyyy"
            />
          </div> */}
        </div>
        <div>
          <label className="block text-regularText font-medium mb-[.5vw]">Special Notes</label>
          <textarea
            name="specialNotes"
            value={formData.specialNotes}
            onChange={handleChange}
            className="w-full p-2 border rounded-[12px] h-24"
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
      <div className='w-[34vw]'>
      <Calendar
        onChange={setDate}
        value={date}
        // You can add more props for locale, minDate, maxDate, etc.
      />
      </div>
      <div className='w-[25vw] flex flex-col gap-[12px] mx-auto'>
        {availableSlots.map(slot => (
          <div onClick={()=>setFormData(prev=>({...prev,timeSlot:slot.value}))} key={slot.value}   className={`cursor-pointer py-[12px] w-[280px] text-center font-bold text-mediumText  border-[rgba(04,43,43,.32)] border-[1px] rounded-[14px] bg-white  ${formData.timeSlot===slot.value?'bg-[rgba(04,43,43,1)] text-white':'bg-white text-[rgba(04,43,43,.32)]'}`}>
            <p>{slot.display}</p>
          </div>
        ))}
      </div>
      </div>
      </div>
    </div>
  );
};

export default BookingForm;