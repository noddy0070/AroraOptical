import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router";
import { Size,Shape,Type,Colors  ,Categories,Material,Brand  } from './../../../data/glassesInformationData'
import ImageUpload from "@/components/ImageFunctionality";
import axios from "axios";
import { ArrayInputField, AttributeSection, FormField } from "@/components/ProductFields";
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
};


const AddProduct=()=>{
  // Variables Declaration
    const navigate=useNavigate()
    const [uploadedImages, setUploadedImages] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [frameAttributes, setFrameAttributes] = useState([]);
    const [lensAttributes, setLensAttributes] = useState([]);
    const [generalAttributes, setGeneralAttributes] = useState([]);
    const [form, setForm] = useState(defaultForm);


      // Function used in handleChange to create a map value to store in lens, frame and general Attribute
      const updateAttributeArray = (prevArray, attrName, value) => {
        const existingIndex = prevArray.findIndex(attr => attr.name === attrName);
        const updatedArray = [...prevArray];
      
        if (existingIndex !== -1) {
          updatedArray[existingIndex].value = value;
        } else {
          updatedArray.push({ name: attrName, value });
        }
      
        return updatedArray;
      };
      
   
      // Handles change of data in the form
      const handleChange = (e, index, attrName) => {
        const { name, value } = e.target;
      
        // For array-based fields like size or stock
        if (["size", "stock"].includes(name)) {
          setForm((prevForm) => {
            const updatedArray = [...prevForm[name]];
            updatedArray[index] = value;
            return { ...prevForm, [name]: updatedArray };
          });
          return;
        }
      
        // For attribute maps
        const attributeFields = ["lensAttributes", "frameAttributes", "generalAttributes"];
        if (attributeFields.includes(name)) {
          setForm((prevForm) => ({
            ...prevForm,
            [name]: updateAttributeArray(prevForm[name], attrName, value)
          }));
          return;
        }
      
        // Default input fields
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
      };
      

      
      // handle submition of form i.e product is added to database
      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Started submitting product...")
      
        try {
          const response = await axios.post(`${baseURL}/api/admin/add-product`, form);
          if (response.status === 200 || response.status === 201) {
            alert('Product added successfully!');
            setForm(defaultForm);
            setUploadedImages([]);
          } 
        } catch (error) {
          console.error('Error submitting product:', error);
          alert(error.response?.data?.message || 'An error occurred while submitting the product.');
        }
        console.log("Finished submitting product...")
      };
      
      // Adds Images to form after addition of every image
      useEffect(() => {
        setForm((prev) => ({
          ...prev,
          images: uploadedImages, 
        }));
      }, [uploadedImages]); 

      // Gets attributes from server to show in add products
      useEffect(() => {
        axios.get(`${baseURL}/api/admin/get-attributes`)
        .then((res) => {
          setAttributes(res.data);
          distributeAttributes(res.data);
        })
        .catch((err) => {
          console.error('Failed to fetch products:', err);
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
    
      console.log(form)
     
      

    return (
        <div className="w-full px-[2vw] py-[2vw] flex flex-col gap-[1vw] ">

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
                      <FormField label="Gender" name="gender" value={form.gender} onChange={handleChange} options={["Male", "Female", "Unisex", "Other"]} />
                    </div>

                    <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} />
                    <FormField label="Price" name="price" value={form.price} onChange={handleChange} />
                    <FormField label="Tax Rate" name="taxRate" value={form.taxRate} onChange={handleChange} />
                    <FormField label="Discount" name="discount" value={form.discount} onChange={handleChange} />
                    <FormField label="Advertising Hashtags" name="hashtags" value={form.hashtags} onChange={handleChange} />
                    <FormField label="Sellable" name="isSellable" value={form.isSellable} onChange={handleChange} options={["true","false"]} />

                  </div>

                  {/* Frame Attribute */}
                  <AttributeSection title="Frame Attributes" attributes={frameAttributes}
                    formKey="frameAttributes" form={form} handleChange={handleChange}/>

                  {/* Lens Attribute */}
                  <AttributeSection title="Lens Attributes"attributes={lensAttributes} 
                    formKey="lensAttributes" form={form} handleChange={handleChange}/>

                  {/* General Attribute */}
                  <AttributeSection title="General Attributes" attributes={generalAttributes}
                    formKey="generalAttributes" form={form} handleChange={handleChange}/>
                </div>
                  
                {/*Section Containing Image, Size and Stock Selection  */}
                <div className="shadow-adminShadow p-[1vw]   rounded-[.5vw]">
                  
                <ImageUpload uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} />
                <div className="grid grid-cols-4 gap-[1vw]">
                  <ArrayInputField label="Size" name="size" values={form.size} handleChange={handleChange} />
                  <ArrayInputField label="Stock" name="stock" values={form.stock} handleChange={handleChange} />
                </div>

                {/* Button To add stocks fiels */}
                <button onClick={() => { setForm((prev) => ({ ...prev, size: [...prev.size, ''], stock: [...prev.stock, ''], }));}} className="text-blue-500">
                  Add Stock 
                </button>

                {/* Button To save Product */}
                <button onClick={handleSubmit} className={`w-full mt-[1vw] py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700`}>
                  Save Product
                </button>
      </div>

        </div>
    )
}


export default AddProduct;

