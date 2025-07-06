import React, { useState, useEffect } from 'react'
import { State, City } from 'country-state-city';

const AddressDialougeBox = ({ isOpen, onClose, handleAddressSubmit, isEditAddress, addressData }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    pincode: '',
    flat: '',
    area: '',
    state: '',
    city: '',
    deliveryInstruction: ''
  });
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateCode, setSelectedStateCode] = useState('');

  useEffect(() => {
    if (isEditAddress) {
      setFormData(addressData);
    }
  }, [isEditAddress, addressData]);

  // Load all Indian states on mount
  useEffect(() => {
    const allStates = State.getStatesOfCountry('IN');
    setStates(allStates);
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (selectedStateCode) {
      const allCities = City.getCitiesOfState('IN', selectedStateCode);
      setCities(allCities);
    } else {
      setCities([]);
    }
  }, [selectedStateCode]);

  // Handle pincode lookup
  useEffect(() => {
    if (formData.pincode.length === 6) {
      setPincodeLoading(true);
      setPincodeError('');
      fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
        .then(res => res.json())
        .then(data => {
          if (
            data &&
            data[0] &&
            data[0].Status === 'Success' &&
            data[0].PostOffice &&
            data[0].PostOffice.length > 0
          ) {
            const postOffice = data[0].PostOffice[0];
            // Find state code from state name
            const foundState = states.find(
              s => s.name.toLowerCase() === (postOffice.State || '').toLowerCase()
            );
            setFormData(prev => ({
              ...prev,
              city: postOffice.District || '',
              state: postOffice.State || ''
            }));
            if (foundState) {
              setSelectedStateCode(foundState.isoCode);
            }
          } else {
            setPincodeError('Invalid pincode or not found');
            setFormData(prev => ({ ...prev, city: '', state: '' }));
            setSelectedStateCode('');
          }
        })
        .catch(() => {
          setPincodeError('Error fetching pincode info');
          setFormData(prev => ({ ...prev, city: '', state: '' }));
          setSelectedStateCode('');
        })
        .finally(() => setPincodeLoading(false));
    } else {
      setPincodeError('');
      setFormData(prev => ({ ...prev, city: '', state: '' }));
      setSelectedStateCode('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.pincode, states]);

  // When state changes, update state in formData and reset city
  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    const stateObj = states.find(s => s.isoCode === stateCode);
    setSelectedStateCode(stateCode);
    setFormData(prev => ({
      ...prev,
      state: stateObj ? stateObj.name : '',
      city: ''
    }));
  };

  // When city changes, update city in formData
  const handleCityChange = (e) => {
    setFormData(prev => ({
      ...prev,
      city: e.target.value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddressSubmit(formData);
    onClose();
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  console.log(formData);
  return (
    <div className="fixed inset-0 bg-black font-roboto pt-[200px] bg-opacity-50 flex items-center justify-center z-50 min-h-screen overflow-y-auto p-[2vw]" onClick={onClose}>
      <div className="bg-white rounded-[.5vw] w-[600px] " onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#F5F5F5] rounded-t-[.5vw]  flex justify-between px-[1.5vw] py-[1vw] items-center mb-[1vw] border-b border-gray-300">
          <h2 className="text-smallText  font-bold">Add New Address</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-regularText font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[1vw] px-[2vw] pb-[2vw]">
          <div className="grid grid-cols-1 gap-[1vw] ">
            {/* Full Name */}
            <div>
              <label className="block text-smallText font-roboto font-medium mb-[8px]">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full p-[12px] border border-gray-300 rounded-[0.375vw] text-smallText font-roboto focus:outline-none focus:border-gray-700"
                placeholder="Enter your full name"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-smallText font-roboto font-medium mb-[0.5vw]">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                className="w-full p-[12px] border border-gray-300 rounded-[0.375vw] text-smallText font-roboto focus:outline-none focus:border-gray-700"
                placeholder="Enter 10-digit mobile number"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-smallText font-roboto font-medium mb-[0.5vw]">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
                pattern="[0-9]{6}"
                className="w-full p-[12px] border border-gray-300 rounded-[0.375vw] text-smallText font-roboto focus:outline-none focus:border-gray-700"
                placeholder="Enter 6-digit pincode"
                maxLength={6}
              />
              {pincodeLoading && <span className="text-xs text-gray-500 ml-2">Detecting...</span>}
              {pincodeError && <span className="text-xs text-red-500 ml-2">{pincodeError}</span>}
            </div>

            {/* Flat/House No */}
            <div>
              <label className="block text-smallText font-roboto font-medium mb-[0.5vw]">
                Flat/House No
              </label>
              <input
                type="text"
                name="flat"
                value={formData.flat}
                onChange={handleInputChange}
                required
                className="w-full p-[12px] border border-gray-300 rounded-[0.375vw] text-smallText font-roboto focus:outline-none focus:border-gray-700"
                placeholder="Enter flat/house number"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-smallText font-roboto font-medium mb-[0.5vw]">
                Area
              </label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                className="w-full p-[12px] border border-gray-300 rounded-[0.375vw] text-smallText font-roboto focus:outline-none focus:border-gray-700"
                placeholder="Enter area/locality"
              />
            </div>

            {/* State Dropdown */}
            <div>
              <label className="block text-smallText font-roboto font-medium mb-[0.5vw]">
                State
              </label>
              <select
                name="state"
                value={selectedStateCode}
                onChange={handleStateChange}
                required
                className="w-full p-[12px] border border-gray-300 rounded-[0.375vw] text-smallText font-roboto focus:outline-none focus:border-gray-700 bg-white"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                ))}
              </select>
            </div>

            {/* City Dropdown */}
            <div>
              <label className="block text-smallText font-roboto font-medium mb-[0.5vw]">
                City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleCityChange}
                required
                className="w-full p-[12px] border border-gray-300 rounded-[0.375vw] text-smallText font-roboto focus:outline-none focus:border-gray-700 bg-white"
                disabled={!selectedStateCode}
              >
                <option value="">{selectedStateCode ? 'Select City' : 'Select State First'}</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>

            {/* Delivery Instruction (Optional) */}
            <div>
              <label className="block text-smallText font-roboto font-medium mb-[0.5vw]">
                Delivery Instruction <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                name="deliveryInstruction"
                value={formData.deliveryInstruction}
                onChange={handleInputChange}
                className="w-full p-[12px] border border-gray-300 rounded-[0.375vw] text-smallText font-roboto focus:outline-none focus:border-gray-700 min-h-[60px] resize-y"
                placeholder="E.g. Leave at the door, call on arrival, etc."
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-[1vw] pt-[1vw]">
            <button
              type="submit"
              className="w-[16.125vw] p-[0.75vw] bg-white text-black rounded-[3.125vw] py-[1vw] shadow-[0px_4px_10px_rgba(0,_0,_0,_0.5)] px-[3.5vw] text-smallText font-roboto duration-300
              transition-all hover:shadow-[0px_4px_10px_rgba(0,_0,_0,_1)]"
            >
              Use this Address
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddressDialougeBox
