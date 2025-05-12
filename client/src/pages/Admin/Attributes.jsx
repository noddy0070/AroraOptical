import { TitleButton } from "@/components/button";
import axios from "axios";
import { useState,useEffect } from "react";
// import { useNavigate } from "react-router-dom";

export default function AttributesPage() {
    const [showModal, setShowModal] = useState(false);
    const [attributeName, setAttributeName] = useState('');
    const [attributeType, setAttributeType] = useState('');
    const [valueType, setValueType] = useState('Single');
    const [attributes, setAttributes] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const [newAttributeValue, setNewAttributeValue] = useState(""); // new value input
    // const navigate = useNavigate();

    const handleConfirm = async () => {
        const payload = {
            name: attributeName,
            attributeType: attributeType,
            attributeValueType: valueType,
        };
        try {
            // replace URL with your backend endpoint
            const response = await axios.post('http://localhost:3000/api/admin/add-attributes', payload);

            if (response.status === 200 || response.status === 201) {
              alert('Attribute added successfully!');
              setShowModal(false);
              setAttributeName('');
              setAttributeType('');
              setValueType('String');
              axios.get(`http://localhost:3000/api/admin/get-attributes`).then((res) => {setAttributes(res.data);;})
              .catch((err) => {console.error('Failed to fetch products:', err);});
          } else {
              alert('Failed to add attribute.');
          }
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to server.');
        }
    };
    
    useEffect(() => {
      axios.get(`http://localhost:3000/api/admin/get-attributes`)
      .then((res) => {
        setAttributes(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
      });
    }, []);

    const deleteAttribute = async (attributeId) => {
      if (!window.confirm('Are you sure you want to delete this attribute?')) {
        return;
      }
    
      try {
        const response = await axios.delete(`http://localhost:3000/api/admin/delete-attributes/${attributeId}`); // adapt your API endpoint
    
        if (response.status === 200||response.status === 201) {
          alert('Attribute deleted successfully!');
          axios.get(`http://localhost:3000/api/admin/get-attributes`).then((res) => {setAttributes(res.data);})
          .catch((err) => {console.error('Failed to fetch products:', err);});
        } else {
          alert('Failed to delete attribute.');
        }
      } catch (error) {
        console.error('Error deleting attribute:', error);
        alert('Server error while deleting attribute.');
      }
    };


    const editAttribute = async (attributeId, updatedData) => {
      try {
        const response = await axios.put(`http://localhost:3000/api/admin/edit-attributes`, updatedData);
    
        if (response.status === 200 || response.status === 201) {
          alert('Attribute updated successfully!');
        } else {
          alert('Failed to update attribute.');
        }
      } catch (error) {
        console.error('Error editing attribute:', error);
        alert('Server error while editing attribute.');
      }
      setEditModalOpen(false);
    };

  

    const openEditModal = (attribute) => {
      setSelectedAttribute(attribute);
      setEditModalOpen(true);
    };

    const handleEditChange = (e, index) => {
      const { name, value } = e.target;
        setSelectedAttribute((prevForm) => ({ ...prevForm, [name]: value }));
    };

    

    // Handle adding a new value to the attribute

    // Add new value to the dropdown
    const handleAddValue = () => {
      const trimmedValue = newAttributeValue.trim();
      if (trimmedValue && !selectedAttribute.attributeValues.includes(trimmedValue)) {
        setSelectedAttribute(prevForm => ({
          ...prevForm,
          attributeValues: [...prevForm.attributeValues, trimmedValue],
        }));
        setNewAttributeValue("");
      }
    };


      // Remove a value from the dropdown
      const handleRemoveValue = (valueToRemove) => {
        setSelectedAttribute(prevForm => ({
          ...prevForm,
          attributeValues: prevForm.attributeValues.filter(value => value !== valueToRemove),
          selectedValue: prevForm.selectedValue === valueToRemove ? "" : prevForm.selectedValue, // if selected one is removed, clear selection
        }));
      };



    

    return (
        <div className="w-full px-[2.25vw] py-[2.25vw] flex flex-col gap-[5.5vw] font-roboto">
            <div className="shadow-adminShadow w-full py-[1.5vw] min-h-screen">
                <div className="flex flex-row  px-[1.875vw] w-full mb-[4vw]">
                    <h5 className='text-h5Text font-dyeLine font-bold'>Attributes</h5>

                    <div className="ml-auto">
                        <TitleButton onClick={() => setShowModal(true)} btnHeight={4.25} btnRadius={3} btnWidth={16} btnTitle={"Add Attributes"} />
                    </div>
                </div>

                {/* your grid content here */}
                <div className="grid grid-cols-4 gap-4 px-[1.875vw] text-center">
                  <div className="col-span-1 flex flex-col gap-[1vw]">
                  <p className='text-regularText font-bold text-center'>Attribute Name</p>
                    {attributes.map((attribute, index) => (
                      <div key={index} >
                        <p className='text-regularText  font-roboto'>{attribute.name}</p>
                      </div>
                    ))}  
                  </div>

                  <div className='flex flex-col gap-[1vw] '>
                <p className='text-regularText font-bold text-center'>Attribute Type</p>
                {attributes.map((attribute, index) => (
                      <div key={index} >
                        <p className='text-regularText  font-roboto'>{attribute.attributeType}</p>
                      </div>
                    ))}  
                  </div>


                <div className='flex flex-col gap-[1vw] '>
                <p className='text-regularText font-bold text-center'>Attribute Value Type</p>
                {attributes.map((attribute, index) => (
                      <div key={index} >
                        <p className='text-regularText  font-roboto'>{attribute.attributeValueType}</p>
                      </div>
                    ))}  
                  </div>

                  <div className='flex flex-col gap-[1vw] '>
                <p className='text-regularText font-bold text-center'>Action</p>
                {attributes.map((attribute, index) => (
                <div key={index} className='flex justify-center gap-[.625vw] items-center'>                
                    <svg className='w-[1.5vw] h-[1.125vw] cursor-pointer' viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 9C1 9 5 1 12 1C19 1 23 9 23 9C23 9 19 17 12 17C5 17 1 9 1 9Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <svg  onClick={() => openEditModal(attribute)}  className='w-[1.5vw] h-[1.5vw] cursor-pointer' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 20H21M16.5 3.49998C16.8978 3.10216 17.4374 2.87866 18 2.87866C18.2786 2.87866 18.5544 2.93353 18.8118 3.04014C19.0692 3.14674 19.303 3.303 19.5 3.49998C19.697 3.69697 19.8532 3.93082 19.9598 4.18819C20.0665 4.44556 20.1213 4.72141 20.1213 4.99998C20.1213 5.27856 20.0665 5.55441 19.9598 5.81178C19.8532 6.06915 19.697 6.303 19.5 6.49998L7 19L3 20L4 16L16.5 3.49998Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <svg onClick={()=>deleteAttribute(attribute._id)} className='w-[1.5vw] h-[1.5vw] cursor-pointer' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z" fill="#1D1B20"/>
                    </svg>
                </div>
                ))}
                </div>
                </div>
                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-8 w-[80vw] md:w-[30vw] flex flex-col gap-6">
                            <h2 className="text-xl font-bold">Add New Attribute</h2>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold">Attribute Name:</label>
                                <input
                                    type="text"
                                    value={attributeName}
                                    onChange={(e) => setAttributeName(e.target.value)}
                                    className="border p-2 rounded"
                                    placeholder="Enter attribute name"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold">Attribute Type:</label>
                                <select
                                    value={attributeType}
                                    onChange={(e) => setAttributeType(e.target.value)}
                                    className="border p-2 rounded"
                                >
                                    <option value="">Select type</option>
                                    <option value="Lens">Lens</option>
                                    <option value="Frame">Frame</option>
                                    <option value="General">General</option>
                                    {/* Add more types if needed */}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold">Value Type:</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" value="Single" checked={valueType === 'Single'} 
                                        onChange={() => setValueType('Single')}/>
                                        Single
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" value="Multiple" checked={valueType === 'Multiple'}
                                            onChange={() => setValueType('Multiple')}/>
                                        Multiple
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 text-white">
                                    Cancel
                                </button>
                                <button onClick={handleConfirm}
                                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                 {/* Modal */}
                 {editModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-8 w-[80vw] md:w-[30vw] flex flex-col gap-6">
                            <h2 className="text-xl font-bold">Edit Attribute</h2>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold">Attribute Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={selectedAttribute.name}
                                    onChange={(e) => handleEditChange(e)}
                                    className="border p-2 rounded"
                                    placeholder="Enter attribute name"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold">Attribute Type:</label>
                                <select
                                    value={selectedAttribute.attributeType}
                                    name="attributeType"
                                    onChange={(e) => handleEditChange(e)}
                                    className="border p-2 rounded"
                                >
                                    <option value="">Select type</option>
                                    <option value="Lens">Lens</option>
                                    <option value="Frame">Frame</option>
                                    <option value="General">General</option>
                                    {/* Add more types if needed */}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold">Value Type:</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="attributeValueType" value="Single" checked={selectedAttribute.attributeValueType === 'Single'} 
                                        onChange={(e) => handleEditChange(e)}/>
                                        Single
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="attributeValueType" value="Multiple" checked={selectedAttribute.attributeValueType === 'Multiple'}
                                            onChange={(e) => handleEditChange(e)}/>
                                        Multiple
                                    </label>
                                </div>
                            </div>
                            
                            {selectedAttribute.attributeValueType === 'Multiple' && (
                                <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold">Attribute Values:</label>
                              
                                {/* Input to add new value */}
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={newAttributeValue}
                                    onChange={(e) => setNewAttributeValue(e.target.value)}
                                    className="border p-2 rounded flex-1"
                                    placeholder="Enter a new value"
                                  />
                                  <button
                                    type="button"
                                    onClick={handleAddValue}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                  >
                                    Add
                                  </button>
                                </div>
                              
                                {/* List of added values with Remove option */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {selectedAttribute.attributeValues.map((value, index) => (
                                    <div key={index} className="flex items-center bg-gray-200 px-2 py-1 rounded">
                                      <span>{value}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveValue(value)}
                                        className="ml-2 text-red-500"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                            )}

                            <div className="flex justify-end gap-4">
                                <button onClick={() => setEditModalOpen(false)}
                                    className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 text-white">
                                    Cancel
                                </button>
                                <button onClick={()=>editAttribute(selectedAttribute._id, selectedAttribute)}
                                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
