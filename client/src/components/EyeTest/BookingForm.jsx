import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import eyeTestBanner from '../../assets/images/eyeTestBanner.png'
import axios from 'axios';
import { baseURL } from '@/url';

import CalendarComponent from './CalendarComponent';
const BookingForm = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const toastThenRedirectHome = (type, message) => {
    toast[type](message, {
      autoClose: 2000,
      onClose: () => navigate('/'),
    });
  };

  const [formData, setFormData] = useState({
    userId: user?._id,
    patientName: user?.name || '',
    phoneNumber: '',
    email: user?.email || '',
    // Force user to explicitly pick a date from calendar
    testDate: null,
    timeSlot: '',
    specialNotes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log('formData.testDate in BookingForm:', formData.testDate);
    setFormData(prev => ({ ...prev, timeSlot: '' }));
    if (formData.testDate) {
      fetchAvailableSlots(formData.testDate);
    } else {
      setAvailableSlots([]);
    }
  }, [formData.testDate]);

  const fetchAvailableSlots = async (date) => {
    try {
      if (!date) return;
      const formattedDate = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-');
      const response = await fetch(`${baseURL}/api/eye-test/available-slots?date=${formattedDate}`);
      const data = await response.json();
      console.log(data);
      setAvailableSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to fetch available time slots');
    }
  };
  console.log(formData)

  const selectedSlotObj = availableSlots.find(s => s.value === formData.timeSlot);
  const isSelectedSlotFull = !!selectedSlotObj?.isFull;

  const getSlotBookedCount = (slot) => {
    // Be defensive: production API may serialize numbers as strings or return legacy shapes.
    const raw = slot?.bookedCount ?? slot?.count ?? 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // hard guard against double-clicks
    if (!formData.testDate) {
      toast.error('Please select a date');
      return;
    }
    if (!formData.timeSlot) {
      toast.error('Please select a time slot');
      return;
    }
    if (isSelectedSlotFull) {
      toast.error('This time slot is fully booked');
      return;
    }

    setLoading(true);

    try {
      // Find the selected slot object
      const selectedSlot = availableSlots.find(slot => slot.value === formData.timeSlot);
      if (!selectedSlot) {
        throw new Error('Invalid time slot selected');
      }

      const response = await axios.post(`${baseURL}/api/eye-test/book`, {
        data: {
          ...formData,
          timeSlot: selectedSlot.value, // Send the 24-hour format to backend
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const data = response.data;

      if (response.status !== 201) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      toastThenRedirectHome('success', 'Your slot has been scheduled succesfully');
    } catch (error) {
      toastThenRedirectHome('error', 'Sorry we are not accepting eye test for now');
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

      <div className='flex flex-col md:flex-row gap-[2vw] justify-center '>
      <form onSubmit={handleSubmit} className="space-y-4 w-full md:w-[25vw] mt-[1vw] ">
      <h2 className="text-h4Text font-semibold mb-[1vw]">Patient Details</h2>

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
          disabled={loading || !formData.testDate || !formData.timeSlot || isSelectedSlotFull}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Booking...' : 'Book Eye Test'}
        </button>
      </form>
      <div className=' '>
      <CalendarComponent formData={formData} setFormData={setFormData}/>
      </div>
      <div className=' flex flex-row md:flex-col gap-[.75vw] w-full md:w-[25vw] mt-[1-+vw] '>
        <span className='text-[#192020] text-mediumText '>
          {formData.testDate ? new Date(formData.testDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          }) : 'Select a date'}
        </span>
        <div className='flex flex-row md:flex-col flex-wrap gap-[.75vw]'>
        {availableSlots.map(slot => (
          (() => {
            const bookedCount = getSlotBookedCount(slot);
            const capacity = Number(slot?.capacity ?? 4);
            const isFull = typeof slot?.isFull === 'boolean'
              ? slot.isFull
              : bookedCount >= (Number.isFinite(capacity) ? capacity : 4);

            return (
          <div
            key={slot.value}
            onClick={() => {
              if (isFull) return;
              setFormData(prev => ({ ...prev, timeSlot: slot.value }));
            }}
            className={[
              'py-[.75vw] w-[17.5vw] whitespace-nowrap text-center font-bold text-mediumText border-[rgba(04,43,43,.32)] border-[.0625vw] rounded-[.875vw] transition-colors duration-300',
              isFull ? 'cursor-not-allowed bg-black text-white' : 'cursor-pointer',
              !isFull && bookedCount === 0 ? 'bg-green-500 text-white' : '',
              !isFull && (bookedCount === 1 || bookedCount === 2) ? 'bg-yellow-400 text-black' : '',
              !isFull && bookedCount === 3 ? 'bg-red-600 text-white' : '',
              formData.timeSlot === slot.value && !isFull ? 'ring-2 ring-offset-2 ring-[rgba(04,43,43,1)]' : '',
            ].filter(Boolean).join(' ')}
          >
            <p>{slot.display}</p>
          </div>
            );
          })()
        ))}
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default BookingForm;