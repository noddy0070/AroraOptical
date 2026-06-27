import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import eyeTestBanner from '../../assets/images/eyeTestBanner.png';
import axios from 'axios';
import { baseURL } from '@/url';
import CalendarComponent from './CalendarComponent';

// ── Icons ─────────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
  </svg>
);
const MailIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, icon, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>
      )}
      <div className={icon ? '[&>*]:pl-9' : ''}>{children}</div>
    </div>
  </div>
);

// ── Input styling ─────────────────────────────────────────────────────────────
const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow shadow-sm';

// ── Slot availability label ───────────────────────────────────────────────────
const slotLabel = (count, capacity) => {
  if (count === 0) return 'Available';
  if (count >= capacity) return 'Full';
  const rem = capacity - count;
  return `${rem} left`;
};

const BookingForm = () => {
  const { user }   = useSelector((state) => state.auth);
  const navigate   = useNavigate();

  const toastThenRedirectHome = (type, message) => {
    toast[type](message, { autoClose: 2000, onClose: () => navigate('/') });
  };

  const [formData, setFormData] = useState({
    userId:      user?._id,
    patientName: user?.name  || '',
    phoneNumber: '',
    email:       user?.email || '',
    testDate:    null,
    timeSlot:    '',
    specialNotes:'',
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, timeSlot: '' }));
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
      const res  = await fetch(`${baseURL}/api/eye-test/available-slots?date=${formattedDate}`);
      const data = await res.json();
      setAvailableSlots(data);
    } catch {
      toast.error('Failed to fetch available time slots');
    }
  };

  const selectedSlotObj    = availableSlots.find((s) => s.value === formData.timeSlot);
  const isSelectedSlotFull = !!selectedSlotObj?.isFull;

  const getSlotBookedCount = (slot) => {
    const raw = slot?.bookedCount ?? slot?.count ?? 0;
    const n   = Number(raw);
    return Number.isFinite(n) ? n : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!formData.testDate)  { toast.error('Please select a date'); return; }
    if (!formData.timeSlot)  { toast.error('Please select a time slot'); return; }
    if (isSelectedSlotFull)  { toast.error('This time slot is fully booked'); return; }

    setLoading(true);
    try {
      const selectedSlot = availableSlots.find((s) => s.value === formData.timeSlot);
      if (!selectedSlot) throw new Error('Invalid time slot selected');

      const response = await axios.post(
        `${baseURL}/api/eye-test/book`,
        { data: { ...formData, timeSlot: selectedSlot.value } },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      if (response.status !== 201) throw new Error(response.data?.message || 'Failed to book appointment');
      toastThenRedirectHome('success', 'Your slot has been scheduled successfully');
    } catch {
      toastThenRedirectHome('error', 'Sorry, we are not accepting eye tests for now');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const formattedSelectedDate = formData.testDate
    ? new Date(formData.testDate).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
    : null;

  const canBook = !loading && formData.testDate && formData.timeSlot && !isSelectedSlotFull;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero banner — full viewport height ──────────────────────────────── */}
      <div className="relative w-full h-[50vh] md:h-min overflow-hidden">
        <img
          src={eyeTestBanner}
          alt="Eye Test Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-4xl">
          <p className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-2">Complimentary Service</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">Book Your Eye Test</h1>
          <p className="text-white/80 mt-2 text-sm md:text-base max-w-md">
            Get a professional eye examination at our store. Select a date and time that works for you.
          </p>
        </div>
      </div>

      {/* ── Main content — 3-column single row ───────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Column 1 — Patient details */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Patient Details</h2>
              <p className="text-xs text-gray-400 mt-0.5">Fill in your information to confirm the booking</p>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

              <Field label="Full Name" icon={<UserIcon />}>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className={inputCls}
                />
              </Field>

              <Field label="Phone Number" icon={<PhoneIcon />}>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className={inputCls}
                />
              </Field>

              <Field label="Email Address" icon={<MailIcon />}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </Field>

              <Field label="Special Notes (optional)">
                <textarea
                  name="specialNotes"
                  value={formData.specialNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any concerns, allergies, or special requirements…"
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {/* Booking summary */}
              {(formData.testDate || formData.timeSlot) && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Booking Summary</p>
                  {formData.testDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CalendarIcon />
                      <span className="font-medium">{formattedSelectedDate}</span>
                    </div>
                  )}
                  {formData.timeSlot && selectedSlotObj && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <ClockIcon />
                      <span className="font-medium">{selectedSlotObj.display}</span>
                      {isSelectedSlotFull && (
                        <span className="text-xs text-red-600 font-semibold ml-1">(Full — pick another slot)</span>
                      )}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!canBook}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                  canBook
                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Booking…</>
                ) : (
                  <><CheckIcon /> Confirm Appointment</>
                )}
              </button>

              {!formData.testDate && (
                <p className="text-center text-xs text-gray-400">Select a date on the calendar to continue</p>
              )}
            </form>
          </div>

          {/* Column 2 — Calendar */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Select a Date</h2>
              <p className="text-xs text-gray-400 mt-0.5">Appointments available up to 3 months ahead</p>
            </div>
            <div className="px-4 py-4">
              <CalendarComponent formData={formData} setFormData={setFormData} />
            </div>
          </div>

          {/* Column 3 — Time slots */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Available Time Slots</h2>
              {formattedSelectedDate
                ? <p className="text-xs text-gray-500 mt-0.5">{formattedSelectedDate}</p>
                : <p className="text-xs text-gray-400 mt-0.5">Pick a date first</p>
              }
            </div>

            <div className="px-6 py-5">
              {!formData.testDate ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                  <CalendarIcon />
                  <p className="text-sm font-medium">Pick a date to see time slots</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                  <p className="text-2xl">🕐</p>
                  <p className="text-sm font-medium">No slots available for this date</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-100 ring-1 ring-gray-300 inline-block" /> Available</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Filling up</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-900 inline-block" /> Full</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {availableSlots.map((slot) => {
                      const bookedCount = getSlotBookedCount(slot);
                      const capacity    = Number(slot?.capacity ?? 4);
                      const isFull = typeof slot?.isFull === 'boolean'
                        ? slot.isFull
                        : bookedCount >= (Number.isFinite(capacity) ? capacity : 4);
                      const isSelected = formData.timeSlot === slot.value && !isFull;

                      let tileCls = 'relative rounded-xl border px-2.5 py-2.5 text-center text-xs font-semibold transition-all ';

                      if (isFull) {
                        tileCls += 'bg-gray-900 text-white border-gray-900 cursor-not-allowed opacity-60';
                      } else if (isSelected) {
                        tileCls += 'bg-gray-900 text-white border-gray-900 shadow-md ring-2 ring-offset-1 ring-gray-900 cursor-pointer';
                      } else if (bookedCount === 0) {
                        tileCls += 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-900 hover:bg-gray-100 cursor-pointer';
                      } else if (bookedCount <= 2) {
                        tileCls += 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-400 cursor-pointer';
                      } else {
                        tileCls += 'bg-red-50 text-red-700 border-red-200 hover:border-red-400 cursor-pointer';
                      }

                      return (
                        <div
                          key={slot.value}
                          onClick={() => { if (!isFull) setFormData((prev) => ({ ...prev, timeSlot: slot.value })); }}
                          className={tileCls}
                        >
                          <p className="font-bold text-[11px]">{slot.display}</p>
                          <p className={`text-[10px] mt-0.5 font-normal ${isFull ? 'text-white/60' : isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                            {slotLabel(bookedCount, capacity)}
                          </p>
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
