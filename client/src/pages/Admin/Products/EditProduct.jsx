import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router";
import { Size,Shape,Type,Colors  ,Categories,Material,Brand  } from './../../../data/glassesInformationData'
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
};


const EditProduct=()=>{
  // Variables Declaration
    const [uploadedImages, setUploadedImages] = useState([]);
    const [loading,setLoading] =useState(false);
    const navigate=useNavigate();
    const [form, setForm] = useState(defaultForm);
    const { id } = useParams();
    const [product,setProduct]=useState(null);

    // Fetching current product details
    useEffect(()=>{
        axios.get(`${baseURL}/api/admin/get-single-product/${id}`)
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
        }
    },[product])

    
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

      // List of attribute categories to check
      const attributeGroups = ["frameAttributes", "lensAttributes", "generalAttributes"];

      for (let group of attributeGroups) {
        const i = form[group]?.findIndex(attr => attr.name === name);
        if (i !== -1) {
          setForm((prevForm) => {
            const updatedAttributes = [...prevForm[group]];
            updatedAttributes[i] = {
              ...updatedAttributes[i],
              value: value,
            };
            return { ...prevForm, [group]: updatedAttributes };
          });
          return; // Important: exit after updating
        }
      }

      // Fallback for simple fields
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };


      
      // handle submition of form i.e product is added to database
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);      
        try {
          const response = await axios.post(`${baseURL}/api/admin/update-product/${form._id}`, form);
          if (response.status === 200 || response.status === 201) {
            alert('Product Edited successfully!');
            setForm(defaultForm);
            setUploadedImages([]);
            navigate('/Admin/products');
          } 
        } catch (error) {
          console.error('Error submitting product:', error);
          alert(error.response?.data?.message || 'An error occurred while submitting the product.');
        }
        setLoading(false);
        console.log("Finished submitting product...")
      };
      
      // Adds Images to form after addition of every image
      useEffect(() => {
        setForm((prev) => ({
          ...prev,
          images: uploadedImages, 
        }));
      }, [uploadedImages]);

      

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
                      <FormField label="Gender" name="gender" value={form.gender} onChange={handleChange} options={["Male", "Female", "Unisex", "Other"]} />
                    </div>

                    <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} />
                    <FormField label="Price" name="price" value={form.price} onChange={handleChange} />
                    <FormField label="Tax Rate" name="taxRate" value={form.taxRate} onChange={handleChange} />
                    <FormField label="Discounted Price" name="discount" value={form.discount} onChange={handleChange} />
                    <FormField label="Advertising Hashtags" name="hashtags" value={form.hashtags} onChange={handleChange} />
                    <FormField label="Sellable" name="isSellable" value={form.isSellable} onChange={handleChange} options={["true","false"]} />

                  </div>
                  
                  {/* Frame Attribute */}
                  { product.frameAttributes &&<div>
                   <h6 className="text-h5Text font-bold mb-[.5vw]">Frame Attributes</h6>
                  <div className="grid grid-cols-2 gap-[1vw] mb-[1.5vw] font-roboto">
                  
                    
                     {form.frameAttributes?.map((item, index) => (
                      <FormField
                        key={item.name || index}
                        label={item.name}
                        name={item.name}
                        value={item.value || ''}
                        onChange={handleChange}
                      />
                    ))}

                  
                  </div>
                  </div>}

                  {/* Lens Attribute */}
                  { product.lensAttributes &&<div>
                   <h6 className="text-h5Text font-bold mb-[.5vw]">Lens Attributes</h6>
                  <div className="grid grid-cols-2 gap-[1vw] mb-[1.5vw] font-roboto">
                  
                    
                     {form.lensAttributes?.map((item, index) => (
                      <FormField
                        key={item.name || index}
                        label={item.name}
                        name={item.name}
                        value={item.value || ''}
                        onChange={handleChange}
                      />
                    ))}
                  
                  </div>
                  </div>}

                  {/* General Attribute */}
                  { form.lensAttributes &&<div>
                   <h6 className="text-h5Text font-bold mb-[.5vw]">General Attributes</h6>
                  <div className="grid grid-cols-2 gap-[1vw] mb-[1.5vw] font-roboto">
                  
                    
                     {form.generalAttributes?.map((item, index) => (
                      <FormField
                        key={item.name || index}
                        label={item.name}
                        name={item.name}
                        value={item.value || ''}
                        onChange={handleChange}
                      />
                    ))}
                  
                  </div>
                  </div>}
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
                <button disabled={loading} onClick={handleSubmit} className={`w-full mt-[1vw] py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700`}>
                 {loading?"Loading":"Save Edited Product"}
                </button>
      </div>

        </div>)
    )
}


export default EditProduct;
