import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router";
import { Size,Shape,Type,Colors  ,Categories,Material,Brand,Classification  } from './../../../data/glassesInformationData'
import ImageUpload from "@/components/ImageFunctionality";
import { ArrayInputField, AttributeSection, FormField } from "@/components/ProductFields";
import axios from "axios";
import { useParams } from 'react-router';
import { baseURL } from "@/url";


const defaultForm = {
  modelName: '',
  modelTitle: '',
  modelCode:'',
  brand:'',
  isSellable:'',
  category: '',
  gender: '',
  taxRate: '',
  hashtags: '',
  description: '',
  price: 0,
  discount: '',      
  size: [],
  stock: [],
  images: [],
  lensAttributes: [],
  frameAttributes: [],
  generalAttributes: [],
  rx:false  
};


const EditProduct=()=>{
  // Variables Declaration
    const [uploadedImages, setUploadedImages] = useState([]);
    const [loading,setLoading] =useState(false);
    const navigate=useNavigate();
    const [form, setForm] = useState(defaultForm);
    const { id } = useParams();
    const [product,setProduct]=useState(null);
    const [attributes, setAttributes] = useState([]);
    const [frameAttributes, setFrameAttributes] = useState([]);
    const [lensAttributes, setLensAttributes] = useState([]);
    const [generalAttributes, setGeneralAttributes] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]); // Track images pending deletion

    // Fetching current product details
    useEffect(()=>{
        axios.get(`${baseURL}/api/admin/get-single-product/${id}`, {
          withCredentials: true
        })
        .then((res) => {
          setProduct(res.data);
        })
        .catch((err) => {
          console.error('Failed to fetch products:', err);
        });
    },[id])
    
    // Setting the value of product in form
    useEffect(()=>{
        if (product !== null) {
          setForm(product);
          setUploadedImages(product.images || []);
          setDeletedImages([]); // Reset deleted images when product changes
        }
    },[product])

    // Function to handle removing an attribute
    const handleRemoveAttribute = (attributeName, attributeType) => {
      const formKey = `${attributeType.toLowerCase()}Attributes`;
      setForm(prevForm => ({
        ...prevForm,
        [formKey]: prevForm[formKey].filter(attr => attr.name !== attributeName)
      }));
    };

    // Function to handle adding an attribute
    const handleAddAttribute = (attribute, attributeType) => {
      const formKey = `${attributeType.toLowerCase()}Attributes`;
      setForm(prevForm => ({
        ...prevForm,
        [formKey]: [...prevForm[formKey], { name: attribute.name, value: '' }]
      }));
    };

    // Get currently used attributes for a specific type
    const getUsedAttributes = (attributeType) => {
      const formKey = `${attributeType.toLowerCase()}Attributes`;
      const attributes = form[formKey];
      if (!Array.isArray(attributes)) {
        return [];
      }
      return attributes.map(attr => ({
        name: attr.name,
        value: attr.value
      }));
    };

    // Get available attributes for a specific type
    const getAvailableAttributes = (attributeType) => {
      switch(attributeType) {
        case 'Frame':
          return frameAttributes;
        case 'Lens':
          return lensAttributes;
        case 'General':
          return generalAttributes;
        default:
          return [];
      }
    };

    // Gets attributes from server to show in add products
    useEffect(() => {
      axios.get(`${baseURL}/api/admin/get-attributes`, {
        withCredentials: true
      })
      .then((res) => {
        setAttributes(res.data);
        distributeAttributes(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch attributes:', err);
      });
    }, []);

    // Distributes the attribute among all three different variables i.e. lens, frame and general 
    const distributeAttributes = (attributes) => {
      const frames = [];
      const lenses = [];
      const generals = [];
    
      attributes.forEach(attr => {
        if (attr.attributeType === "Frame") {
          frames.push(attr);
        } else if (attr.attributeType === "Lens") {
          lenses.push(attr);
        } else if (attr.attributeType === "General") {
          generals.push(attr);
        }
      });
    
      setFrameAttributes(frames);
      setLensAttributes(lenses);
      setGeneralAttributes(generals);
    };

    console.log("form", form);

    // Function to handle all the changes
    const handleChange = (e, index, attrName) => {
      const { name, value } = e.target;

      // Handle array-based fields like size or stock
      if (["size", "stock"].includes(name)) {
        setForm((prevForm) => {
          const updatedArray = [...prevForm[name]];
          updatedArray[index] = value;
          return { ...prevForm, [name]: updatedArray };
        });
        return;
      }

      // Handle attribute fields
      if (attrName) {
        const formKey = name; // This will be frameAttributes, lensAttributes, or generalAttributes
        setForm((prevForm) => {
          const currentAttributes = Array.isArray(prevForm[formKey]) ? prevForm[formKey] : [];
          const attributeIndex = currentAttributes.findIndex(attr => attr.name === attrName);
          
          if (attributeIndex !== -1) {
            // Update existing attribute
            const updatedAttributes = [...currentAttributes];
            updatedAttributes[attributeIndex] = {
              ...updatedAttributes[attributeIndex],
              value: value
            };
            return { ...prevForm, [formKey]: updatedAttributes };
          } else {
            // Add new attribute
            return {
              ...prevForm,
              [formKey]: [...currentAttributes, { name: attrName, value: value }]
            };
          }
        });
        return;
      }

      // Handle regular fields
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    // Function to extract public_id from Cloudinary URL
    const extractPublicIdFromUrl = (url) => {
      try {
        const urlObj = new URL(url);
        const parts = urlObj.pathname.split('/'); // Split by '/'
        const fileName = parts.pop(); // Get filename with extension
        return fileName.replace(/\.[^/.]+$/, ''); // strip extension
      } catch {
        return null;
      }
    };

    // Handle image removal from uploadedImages
    const handleImageRemove = (imageUrl) => {
      setUploadedImages(prev => prev.filter(url => url !== imageUrl));
      setDeletedImages(prev => [...prev, imageUrl]);
      // Update the form's images array as well
      setForm(prev => ({
        ...prev,
        images: prev.images.filter(url => url !== imageUrl)
      }));
    };

    // Adds Images to form after addition of every image
    useEffect(() => {
      setForm((prev) => ({
        ...prev,
        images: uploadedImages,
      }));
    }, [uploadedImages]);

    // handle submission of form i.e product is edited in database
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);      
      try {
        // First update the product
        const response = await axios.post(`${baseURL}/api/admin/update-product/${form._id}`, form, {
          withCredentials: true
        });
        
        if (response.status === 200 || response.status === 201) {
          // If product update was successful, delete the images from cloud
          if (deletedImages.length > 0) {
            try {
              await Promise.all(deletedImages.map(async imageUrl => {
                const publicId = extractPublicIdFromUrl(imageUrl);
                if (publicId) {
                  await axios.post(`${baseURL}/api/image/delete-image`, { 
                    public_id: publicId 
                  }, {
                    withCredentials: true
                  });
                }
              }));
            } catch (error) {
              console.error('Error deleting images:', error);
              // Even if image deletion fails, we proceed as the product update was successful
            }
          }
          
          alert('Product Edited successfully!');
          setForm(defaultForm);
          setUploadedImages([]);
          setDeletedImages([]);
          navigate('/Admin/products');
        } 
      } catch (error) {
        console.error('Error submitting product:', error);
        alert(error.response?.data?.message || 'An error occurred while submitting the product.');
      }
      setLoading(false);
    };

    return (
        (product && <div className="w-full px-[2vw] py-[2vw] flex flex-col gap-[1vw] ">

                {/* All Attributes Section */}
                <div className=" shadow-adminShadow  p-[1vw] ">
                  {/* Basic Attributes */}
                  <div className="grid grid-cols-2 gap-[1vw] mb-[1.5vw] font-roboto">
                    <FormField label="Model Title" name="modelTitle" value={form.modelTitle} onChange={handleChange} />
                    <FormField label="Model Name" name="modelName" value={form.modelName} onChange={handleChange} />
                    <FormField label="Model Code" name="modelCode" value={form.modelCode} onChange={handleChange} />
                    <FormField label="Brand" name="brand" value={form.brand} onChange={handleChange} options={Brand} />
                    <div className="grid grid-cols-2 gap-[1vw]">
                      <FormField label="Category" name="category" value={form.category} onChange={handleChange} options={Categories} />
                      <FormField label="Gender" name="gender" value={form.gender} onChange={handleChange} options={Classification} />
                    </div>
                    {(form.category == "Eyeglasses" || form.category === "Contact Lenses" || form.category === "Smart Glasses") && (
                      <FormField label="Rx" name="rx" value={form.rx} onChange={handleChange} options={["true","false"]} />
                    )}

                    <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} />
                    <FormField label="Price" name="price" value={form.price} onChange={handleChange} />
                    <FormField label="Tax Rate" name="taxRate" value={form.taxRate} onChange={handleChange} />
                    <FormField label="Discounted Price" name="discount" value={form.discount} onChange={handleChange} />
                    <FormField label="Advertising Hashtags" name="hashtags" value={form.hashtags} onChange={handleChange} />
                    <FormField label="Sellable" name="isSellable" value={form.isSellable} onChange={handleChange} options={["true","false"]} />

                  </div>
                  
                  {/* Frame Attribute */}
                  <AttributeSection 
                    title="Frame Attributes" 
                    attributes={getUsedAttributes('Frame')}
                    formKey="frameAttributes" 
                    form={form} 
                    handleChange={handleChange}
                    onRemoveAttribute={(name) => handleRemoveAttribute(name, 'Frame')}
                    availableAttributes={getAvailableAttributes('Frame')}
                    onAddAttribute={(attr) => handleAddAttribute(attr, 'Frame')}
                  />

                  {/* Lens Attribute */}
                  <AttributeSection 
                    title="Lens Attributes"
                    attributes={getUsedAttributes('Lens')}
                    formKey="lensAttributes" 
                    form={form} 
                    handleChange={handleChange}
                    onRemoveAttribute={(name) => handleRemoveAttribute(name, 'Lens')}
                    availableAttributes={getAvailableAttributes('Lens')}
                    onAddAttribute={(attr) => handleAddAttribute(attr, 'Lens')}
                  />

                  {/* General Attribute */}
                  <AttributeSection 
                    title="General Attributes"
                    attributes={getUsedAttributes('General')}
                    formKey="generalAttributes" 
                    form={form} 
                    handleChange={handleChange}
                    onRemoveAttribute={(name) => handleRemoveAttribute(name, 'General')}
                    availableAttributes={getAvailableAttributes('General')}
                    onAddAttribute={(attr) => handleAddAttribute(attr, 'General')}
                  />
                </div>
                  
                {/*Section Containing Image, Size and Stock Selection  */}
                <div className="shadow-adminShadow p-[1vw]   rounded-[.5vw]">
                  
                <ImageUpload 
                  uploadedImages={uploadedImages} 
                  setUploadedImages={setUploadedImages}
                  onImageRemove={handleImageRemove}
                />

                <div className="grid grid-cols-4 gap-[1vw]">
                  <ArrayInputField label="Size" name="size" values={form.size} handleChange={handleChange} />
                  <ArrayInputField label="Stock" name="stock" values={form.stock} handleChange={handleChange} />
                </div>

                {/* Button To add stocks fiels */}
                <button onClick={() => { setForm((prev) => ({ ...prev, size: [...prev.size, ''], stock: [...prev.stock, ''], }));}} className="text-blue-500">
                  Add Stock 
                </button>

                {/* Button To save Product */}
                <button disabled={loading} onClick={handleSubmit} className={`w-full mt-[1vw] py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700`}>
                 {loading?"Loading":"Save Edited Product"}
                </button>
      </div>

        </div>)
    )
}


export default EditProduct;
