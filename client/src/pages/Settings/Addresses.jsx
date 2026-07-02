import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { baseURL } from '@/url';
import { loginSuccess } from '@/redux/slice/authSlice';
import { toTitleCase } from '../../../shared/pipes/strFormatting';
import AddressDialougeBox from '@/components/AddressDialougeBox';

export default function Addresses() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [isEditAddress, setIsEditAddress] = useState(false);
    const [addressData, setAddressData] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [removingIndex, setRemovingIndex] = useState(null);

    const refreshUser = async () => {
        const userRes = await axios.get(`${baseURL}/api/auth/me`, { withCredentials: true });
        dispatch(loginSuccess({ user: userRes.data.user }));
    };

    const handleAddressSubmit = async (formData) => {
        if (!user?._id) return;
        try {
            if (isEditAddress) {
                await axios.post(`${baseURL}/api/user/address/edit/${user._id}`, { index: editIndex, address: formData }, { withCredentials: true });
            } else {
                await axios.post(`${baseURL}/api/user/address/add/${user._id}`, { address: formData }, { withCredentials: true });
            }
            await refreshUser();
        } catch (error) {
            console.error('Error saving address:', error);
        }
    };

    const handleAddNew = () => {
        setIsEditAddress(false);
        setAddressData(null);
        setEditIndex(null);
        setIsAddressDialogOpen(true);
    };

    const handleEdit = (index) => {
        setIsEditAddress(true);
        setAddressData(user.addressList[index]);
        setEditIndex(index);
        setIsAddressDialogOpen(true);
    };

    const handleRemove = async (index) => {
        if (!user?._id) return;
        setRemovingIndex(index);
        try {
            await axios.post(`${baseURL}/api/user/address/remove/${user._id}`, { index }, { withCredentials: true });
            await refreshUser();
        } catch (error) {
            console.error('Error removing address:', error);
        } finally {
            setRemovingIndex(null);
        }
    };

    const addressList = user?.addressList || [];

    return (
        <>
            <div className='flex flex-row gap-[6vw] md:gap-[2.5vw] items-center justify-between'>
                <h6 className='text-h6TextPhone md:text-h6Text font-bold'>Saved Addresses</h6>
                <button
                    onClick={handleAddNew}
                    className='px-[4vw] md:px-[1.25vw] py-[2vw] md:py-[.5vw] text-smallTextPhone md:text-smallText rounded-[10vw] md:rounded-[2vw] bg-white shadow-[0px_4px_10px_rgba(0,_0,_0,_0.3)] font-roboto font-medium'
                >
                    + Add New Address
                </button>
            </div>

            {addressList.length === 0 ? (
                <p className='text-regularTextPhone md:text-regularText text-gray-500'>You have no saved addresses yet.</p>
            ) : (
                <div className='flex flex-col gap-[4vw] md:gap-[1.25vw]'>
                    {addressList.map((address, index) => (
                        <div
                            key={index}
                            className='flex flex-col md:flex-row gap-[3vw] md:gap-[1vw] justify-between bg-[#F6F6F6] rounded-[3vw] md:rounded-[.75vw] p-[4vw] md:p-[1.25vw]'
                        >
                            <div className='flex flex-col gap-[1vw] md:gap-[.25vw]'>
                                <span className='text-mediumTextPhone md:text-mediumText font-roboto font-semibold'>{toTitleCase(address.fullName)}</span>
                                <span className='text-mediumTextPhone md:text-mediumText font-roboto text-gray-600'>
                                    {address.flat}, {address.area}, {address.city}, {address.state} – {address.pincode}
                                </span>
                                <span className='text-mediumTextPhone md:text-mediumText font-roboto text-gray-600'>{address.mobileNumber}</span>
                                {address.deliveryInstruction && (
                                    <span className='text-smallTextPhone md:text-smallText font-roboto text-gray-400'>Note: {address.deliveryInstruction}</span>
                                )}
                            </div>
                            <div className='flex flex-row md:flex-col gap-[3vw] md:gap-[.75vw] items-start'>
                                <button
                                    onClick={() => handleEdit(index)}
                                    className='text-smallTextPhone md:text-smallText font-roboto font-medium underline'
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleRemove(index)}
                                    disabled={removingIndex === index}
                                    className='text-smallTextPhone md:text-smallText font-roboto font-medium text-red-600 underline disabled:opacity-50'
                                >
                                    {removingIndex === index ? 'Removing…' : 'Remove'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddressDialougeBox
                isOpen={isAddressDialogOpen}
                onClose={() => setIsAddressDialogOpen(false)}
                handleAddressSubmit={handleAddressSubmit}
                isEditAddress={isEditAddress}
                addressData={addressData}
            />
        </>
    );
}
