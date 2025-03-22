import React, { useState } from 'react';
import axios from 'axios';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dohfbsepn/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'AroraOpticals'; // Set this in your Cloudinary dashboard.
const CLOUDINARY_DELETE_URL = 'https://api.cloudinary.com/v1_1/dohfbsepn/image/destroy';
const CLOUDINARY_API_SECRET = "mGc4mgrnhkCrBuvXaN2vFnt5f_s";
const CLOUDINARY_API_KEY = '192436767777992';
import CollectionSvg from '../assets/images/icons/collectionSvg.svg'

const ImageUpload = ({uploadedImages,setUploadedImages}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
  
    if (files.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
      setUploadSuccess(null); // Reset success message
    }
  
    // 🔄 Reset the input value to allow reselecting the same file
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };


  const deleteImageFromCloudinary = async (publicId) => {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
  
      // 🔍 Check if the server is reachable
      await axios.get('http://localhost:3000/health').catch(() => {
        throw new Error('⚠️ Backend server is not running. Start the server before making requests.');
      });
  
      // 🔑 Fetch signature from your backend
      const signatureResponse = await axios.post('http://localhost:3000/generate-signature', {
        public_id: publicId,
        timestamp,
      });
  
      const { signature, api_key } = signatureResponse.data;
  
      if (!signature || !api_key) {
        alert('❌ Failed to get signature. Please check the server response.');
        return;
      }
  
      // 🗑️ Call Cloudinary's delete endpoint
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('api_key', api_key);
  
      const deleteResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dohfbsepn/image/destroy',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      if (deleteResponse.data.result === 'ok') {
        alert('✅ Image deleted successfully!');
        setUploadedImages((prevImages) =>
          prevImages.filter((image) => image.public_id !== publicId)
        );
        setUploadSuccess("Image Deleted Successfully");
      } else {
        alert('❌ Failed to delete image.');
      }
    } catch (error) {
      console.error('Error deleting image:', error.response?.data || error.message);
      alert('Error deleting image. Check console for details.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return alert('Please select images first!');

    setUploading(true);
    setUploadSuccess(null);
    const uploadedImagesList = [];

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await axios.post(CLOUDINARY_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        uploadedImagesList.push({
          url: response.data.secure_url,
          public_id: response.data.public_id,
        });
      }
      setUploadedImages(uploadedImagesList);
      setUploadSuccess('Images uploaded successfully!');
      setSelectedFiles([]); // Clear selected files after upload
    } catch (err) {
      console.error('Upload error details:', err.response?.data || err.message);
      alert(`Upload failed: ${err.response?.data?.error?.message || 'Please check your Cloudinary settings.'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-[1vw] bg-white text-black shadow-adminShadow rounded-[.5vw] flex flex-col gap-[1vw]">
      <h2 className="text-regularText font-bold text-left">Upload Product Images</h2>
      <div className='grid grid-cols-5 gap-[1vw]'>
        <div className='col-span-4 flex flex-row gap-[1vw]'>
          {uploadedImages.length > 0 && (
            <div>
              <p className="text-smallText text-gray-500 font-bold text-left mb-[.5vw]">Uploaded Images</p>
              <div className="flex flex-wrap gap-[1vw]">
                {uploadedImages.map(({ url, public_id }, index) => (
                  <div key={index} className="relative border-dashed border-2 border-gray-300 rounded-[.5vw]">
                    <img
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="w-[14.25vw] h-[14.25vw] object-cover rounded-[.5vw]"
                    />
                    <button
                      onClick={() => deleteImageFromCloudinary(public_id)}
                      className="absolute top-1 right-1 text-red-500 font-bold bg-white rounded-full px-2 py-1 shadow"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div>
              <p className="text-smallText text-gray-500 font-bold text-left mb-[.5vw]">Preview Images</p>
              <div className="flex flex-row gap-[1vw]">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative border-dashed border-2 border-gray-300 rounded-[.5vw]">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-[14.25vw] h-[14.25vw] object-cover rounded-[.5vw]"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 text-red-500 font-bold bg-white rounded-full px-2 py-1 shadow"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className='col-span-1 items-center justify-center'>
        <p className="text-smallText text-gray-500 font-bold text-left mb-[.5vw]">Upload Images</p>
        <div className="relative w-[14.25vw] h-[14.25vw] flex flex-col items-center justify-center bg-gray-100 rounded-[.5vw] border-dashed border-2 border-gray-300">
          <img 
            src={CollectionSvg} 
            className="w-[5vw] h-[5vw] rounded-[.5vw] mb-[.5vw] object-cover"
            alt="Collection"
          />
          <p className='text-gray-500 text-smallText'>image upload</p>
          <input 
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`w-full py-2 rounded-lg text-white font-semibold ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {uploading ? 'Uploading...' : 'Upload Images'}
      </button>

      {uploadSuccess && (
        <p className="text-green-600 text-center mt-4 font-medium">{uploadSuccess}</p>
      )}
    </div>
  );
};

export default ImageUpload;
