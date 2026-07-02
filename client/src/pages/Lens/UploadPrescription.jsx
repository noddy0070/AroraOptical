import { useState, useRef } from 'react';
import axios from 'axios';
import { api } from '@/lib/axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PriceBreakdown, formatCoatingLabel } from '@/components/lensFeatureBox';
import { CartButton, ContactUsButton } from '@/components/button';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dohfbsepn/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'AroraOpticals';

export default function UploadPrescription({ form, addProductToCart, amount, basePrice=0, coatingPrice=null, thicknessPrice=null, isSellable=true, getContactUrl }) {
  const { user } = useSelector(state => state.auth);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(response.data.secure_url);
      toast.success('Prescription photo uploaded');
    } catch {
      toast.error('Upload failed, please try again');
    } finally {
      setUploading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!imageUrl) {
      toast.error('Please upload your prescription photo first');
      return;
    }
    setAdding(true);
    try {
      const res = await api.post('/api/user/prescription/add-photo', {
        userId: user._id,
        prescriptionImage: imageUrl,
      }, {  });
      if (res.data.success) {
        const updatedForm = { ...form, prescriptionId: res.data.prescriptionId };
        await addProductToCart(updatedForm, amount);
      }
    } catch {
      toast.error('Failed to add to cart, please try again');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className='px-[5vw] md:px-0 py-[6vw] md:py-0'>
      <h1 className='font-bold font-dyeLine text-h2TextPhone md:text-h1Text text-center mb-[6vw] md:mb-0'>Upload Prescription</h1>
      <div className='mx-auto py-[4vw] md:py-[1vw] px-[5vw] md:px-[1vw] w-full md:w-[69.75vw] flex flex-col items-center gap-[6vw] md:gap-[1.5vw] font-roboto'>
        <p className='text-regularTextPhone md:text-regularText text-gray-600 text-center max-w-[80vw] md:max-w-[48vw]'>
          Take a clear photo of your prescription and upload it below. Our team will review it and prepare your lenses accordingly.
        </p>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

        {imageUrl ? (
          <div className='flex flex-col items-center gap-[3vw] md:gap-[.75vw]'>
            <img
              src={imageUrl}
              alt="Prescription"
              className='w-[72vw] md:w-[26vw] h-[52vw] md:h-[18vw] object-contain rounded-[2vw] md:rounded-[.5vw] border border-gray-300 bg-gray-50'
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className='text-smallTextPhone md:text-sm underline text-gray-500 hover:text-gray-700'
            >
              Upload a different photo
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className='flex flex-col items-center justify-center gap-[3vw] md:gap-[.75vw] w-[80vw] md:w-[32vw] h-[52vw] md:h-[16vw] border-2 border-dashed border-gray-300 rounded-[2vw] md:rounded-[.75vw] text-gray-500 hover:border-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className='w-[12vw] md:w-[3vw] h-[12vw] md:h-[3vw]' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className='text-regularTextPhone md:text-regularText font-medium'>
              {uploading ? 'Uploading…' : 'Click to upload prescription photo'}
            </span>
            <span className='text-smallTextPhone md:text-xs text-gray-400'>JPG, PNG, or JPEG accepted</span>
          </button>
        )}

        <div className='ml-auto mt-[2vw] md:mt-[1vw] mr-[5vw] md:mr-[2vw] items-center flex flex-row w-full md:w-[68.75vw] justify-end md:justify-start gap-[4vw] md:gap-[2vw]'>
          <PriceBreakdown
            base={basePrice}
            coatingLabel={form.lensCoating ? formatCoatingLabel(form.lensCoating) : null}
            coatingPrice={form.lensCoating ? coatingPrice : null}
            thicknessLabel={form.lensThickness || null}
            thicknessPrice={form.lensThickness ? thicknessPrice : null}
          />
          {isSellable ? (
            <CartButton onClick={handleAddToCart} />
          ) : (
            <ContactUsButton href={getContactUrl(form, amount)} />
          )}
        </div>
      </div>
    </div>
  );
}
