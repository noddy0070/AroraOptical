import React, { useState, useEffect } from 'react';
import { baseURL } from '@/url';
import axios from 'axios';

const TermsAndConditions = () => {
  const [policy, setPolicy] = useState({
    headings: ['Acceptance of Terms', 'Use of Website', 'Product Information', 'Orders and Payment', 'Shipping and Delivery', 'Returns and Refunds', 'Intellectual Property', 'Privacy', 'Limitation of Liability', 'Governing Law'],
    descriptions: [
      'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.',
      'You may use our website for lawful purposes only. You agree not to use the website in any way that could damage, disable, overburden, or impair any server, or the network(s) connected to any server.',
      'We strive to provide accurate product descriptions, images, and specifications. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.',
      'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel your order at any time for certain reasons including but not limited to: product or service availability, errors in the description or price of the product or service, or error in your order.',
      'Shipping times and costs are provided at the time of checkout. We are not responsible for delays caused by shipping carriers or customs.',
      'Our return and refund policy is outlined in our separate Refund Policy. Please review it carefully before making a purchase.',
      'All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of AroraOptical or its content suppliers.',
      'Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website, to understand our practices.',
      'In no event shall AroraOptical, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.',
      'These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions.'
    ],
    email: 'support@aroraopticals.com',
    number: '+91-9876543210',
    introduction: 'These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/admin/get-policy/682e6780fb2ffba94269d8cf`, {
        withCredentials: true
      });
      if (response.data.message) {
        setPolicy(response.data.message);
      }
    } catch (error) {
      console.error('Failed to fetch policy:', error);
      // If policy doesn't exist, keep the default policy data
      console.log('Policy not found, using default data');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(''); // Clear any existing messages
    
    try {
      console.log('Attempting to update Terms and Conditions policy...');
      console.log('Policy data:', policy);
      
      // First try to update the existing policy
      const response = await axios.post(`${baseURL}/api/admin/update-policy/682e6780fb2ffba94269d8cf`, policy, {
        withCredentials: true
      });
      
      console.log('Update response:', response);
      setMessage('Terms and Conditions updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update policy:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      
      // If update fails, try to create a new policy
      if (error.response?.status === 404 || error.response?.status === 400) {
        try {
          console.log('Policy not found, attempting to create new policy...');
          const createResponse = await axios.post(`${baseURL}/api/admin/add-cancellation-policy`, {
            ...policy,
            name: "TermsAndConditions"
          }, {
            withCredentials: true
          });
          console.log('Create response:', createResponse);
          setMessage('Terms and Conditions created successfully!');
          setIsEditing(false);
          setTimeout(() => setMessage(''), 3000);
        } catch (createError) {
          console.error('Failed to create policy:', createError);
          console.error('Create error response:', createError.response);
          setMessage(`Failed to create Terms and Conditions: ${createError.response?.data?.message || createError.message}`);
          setTimeout(() => setMessage(''), 5000);
        }
      } else {
        setMessage(`Failed to update Terms and Conditions: ${error.response?.data?.message || error.message}`);
        setTimeout(() => setMessage(''), 5000);
      }
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setPolicy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHeadingChange = (index, value) => {
    const newHeadings = [...policy.headings];
    newHeadings[index] = value;
    setPolicy(prev => ({
      ...prev,
      headings: newHeadings
    }));
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...policy.descriptions];
    newDescriptions[index] = value;
    setPolicy(prev => ({
      ...prev,
      descriptions: newDescriptions
    }));
  };

  const addSection = () => {
    setPolicy(prev => ({
      ...prev,
      headings: [...prev.headings, 'New Section'],
      descriptions: [...prev.descriptions, 'Enter description here']
    }));
  };

  const removeSection = (index) => {
    if (policy.headings.length > 1) {
      const newHeadings = policy.headings.filter((_, i) => i !== index);
      const newDescriptions = policy.descriptions.filter((_, i) => i !== index);
      setPolicy(prev => ({
        ...prev,
        headings: newHeadings,
        descriptions: newDescriptions
      }));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions Management</h1>
        <p className="text-gray-600">Manage the terms and conditions content for your website</p>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Terms and Conditions Content</h2>
          <div className="space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchPolicy();
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Introduction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Introduction</label>
            {isEditing ? (
              <textarea
                value={policy.introduction}
                onChange={(e) => handleInputChange('introduction', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            ) : (
              <p className="text-gray-700">{policy.introduction}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={policy.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700">{policy.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={policy.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700">{policy.number}</p>
              )}
            </div>
          </div>

          {/* Sections */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Sections</h3>
              {isEditing && (
                <button
                  onClick={addSection}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                >
                  Add Section
                </button>
              )}
            </div>

            <div className="space-y-4">
              {policy.headings.map((heading, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-500">Section {index + 1}</span>
                    {isEditing && policy.headings.length > 1 && (
                      <button
                        onClick={() => removeSection(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={heading}
                        onChange={(e) => handleHeadingChange(index, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-700 font-medium">{heading}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    {isEditing ? (
                      <textarea
                        value={policy.descriptions[index]}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">{policy.descriptions[index]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
