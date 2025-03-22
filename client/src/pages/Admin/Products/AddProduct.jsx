import React,{useState} from "react";
import { useNavigate } from "react-router";
import { Size,Shape,Material,Type,Categories,Colors  } from './../../../data/glassesInformationData'
import ImageUpload from "@/components/ImageFunctionality";

const AddProduct=()=>{
    const navigate=useNavigate()
    const [uploadedImages, setUploadedImages] = useState([]); // Store objects with URL and public_id

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        brand: '',
        regularPrice: '',
        discountPrice: '',
        taxRate: '',
        tags: '',
        size: [],
        color: [],
        shape:'',
        type:'',
        material:'',
        stock: '',
        weight: '',
        newCategory: '',
        newBrand: '',
        newColor: '',
        newSize: '',
      });

    
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
      };
    
      const handleMultiSelectChange = (e, field) => {
        const options = Array.from(e.target.selectedOptions, (option) => option.value);
        setForm({ ...form, [field]: options });
      };
    
      console.log(form)

    return (
        <div className="w-full px-[2vw] py-[2vw] flex flex-col gap-[2vw] bg-bgCreamWhite">
                <div className="flex flex-row justify-between px-[1vw] py-[1vw] items-center  shadow-adminShadow rounded-[.5vw] ">
                    <h2 className="font-bold">Add Products</h2>
                    <button className="text-regularText font-roboto font-medium " onClick={()=>navigate('/Admin/Dashboard/products')}>Back </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1vw] font-roboto ">
                {/* Basic Information */}
                <div className="col-span-2 bg-white p-[1vw]  shadow-adminShadow rounded-[.5vw] flex flex-col gap-[1vw] ">
                        <h2 className="text-regularText font-medium">Basic Information</h2>
                        <div>
                            <label className="text-[12px] font-bold ">TITLE</label>
                            <input type="text" name="title" placeholder="type here" value={form.title} onChange={handleChange} className="w-full mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border" />
                        </div>
                        <div>
                            <label className="text-[12px] font-bold ">DESCRIPTION</label>
                            <textarea name="description" placeholder="type here" value={form.description} onChange={handleChange} className="w-full mt-[4px] h-[7vw] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border " />
                        </div>

                        <div className="grid grid-cols-2 gap-[1vw]">
                            <div>
                                <label className="text-[12px] font-bold ">CATEGORY</label>
                                <select name="category" value={form.category} onChange={handleChange} className="w-full mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border">
                                <option value="">Select Category</option>
                                {Categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                                ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[12px] font-bold ">BRANDS</label>
                                <select name="brand" value={form.brand} onChange={handleChange} className="w-full mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border">
                                <option value="">Select Brand</option>
                                <option value="Mans">Mans</option>
                                <option value="Womans">Womans</option>
                                <option value="Kids">Kids</option>
                                </select>
                            </div>

                        <div>
                            <label className="text-[12px] font-bold ">REGULAR PRICE</label>
                            <input type="number" name="regularPrice" placeholder="type here" value={form.regularPrice} onChange={handleChange} className="w-full mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border" />
                        </div>

                        <div>
                            <label className="text-[12px] font-bold ">DISCOUNT PRICE</label>
                            <input type="number" name="discountPrice" placeholder="type here" value={form.discountPrice} onChange={handleChange} className="w-full mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border" />
                        </div>

                        <div>
                            <label className="text-[12px] font-bold ">TAX RATE</label>
                            <input type="number" name="taxRate" placeholder="type here" value={form.taxRate} onChange={handleChange} className="w-full mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border" />
                        </div>

                        <div>
                            <label className="text-[12px] font-bold ">STOCK</label>
                            <input type="number" name="stock" placeholder="type here" value={form.stock} onChange={handleChange} className="w-full mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border" />
                        </div>
                        
                        
                        </div>
                        <div>
                            <label className="text-[12px] font-bold ">TAGS</label>
                            <textarea name="tags" placeholder="type here" value={form.tags} onChange={handleChange} className="w-full h-[4vw] mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border" />
                        </div>
                        
                </div>

        {/* Specification */}
        <div className="bg-white h-min p-[1vw] shadow-adminShadow rounded-[.5vw] flex flex-col gap-[1vw] ">
        <h2 className="text-regularText font-medium">Specifications</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-bold ">SIZE</label>
              <select multiple value={form.size} onChange={(e) => handleMultiSelectChange(e, 'size')} className="w-full h-[6vw] mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border">
              {Size.map((size) => (
                <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
            <label className="text-[12px] font-bold ">COLOUR</label>
              <select multiple value={form.color} onChange={(e) => handleMultiSelectChange(e, 'color')} className="w-full h-[6vw] mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border">
              {Colors.map((color) => (
                <option key={color.colorName} value={color.colorName}>{color.colorName}</option>
                ))}
              </select>
            </div>
          </div>

            <div>
                <label className="text-[12px] font-bold ">SHAPE</label>
                <select name="shape" value={form.shape} onChange={handleChange} className="w-full mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border">
                <option value="">Select Shape</option>
                {Shape.map((shape) => (
                <option key={shape} value={shape}>{shape}</option>
                ))}                
                </select>
            </div>
            <div>
                <label className="text-[12px] font-bold ">TYPE</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border">
                <option value="">Select Type</option>
                {Type.map((type) => (
                <option key={type} value={type}>{type}</option>
                ))} 
                </select>
            </div>
            <div>
                <label className="text-[12px] font-bold ">MATERIAL</label>
                <select name="material" value={form.material} onChange={handleChange} className="w-full mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border">
                <option value="">Select Material</option>
                {Material.map((Material) => (
                <option key={Material} value={Material}>{Material}</option>
                ))} 
                </select>
            </div>

            <div>
                <label className="text-[12px] font-bold ">WEIGHT</label>
                <input type="number" name="weight" placeholder="type here" value={form.weight} onChange={handleChange} className="w-full mt-[4px] p-[.5vw] bg-adminInputBoxColor text-[14px] rounded-[.45vw] border" />
            </div>
            
        </div>
      </div>
      <ImageUpload uploadedImages={uploadedImages} setUploadedImages={setUploadedImages}/>

        </div>
    )
}


export default AddProduct;