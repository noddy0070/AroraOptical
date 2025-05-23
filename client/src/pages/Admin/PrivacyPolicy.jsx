import {useState,useEffect} from "react";
import { Categories } from './../../data/glassesInformationData'
import axios from "axios";
import { State, City } from "country-state-city";
import { ArrayInputField, ArrayInputFieldPolicies, FormField } from "@/components/ProductFields";
import { baseURL } from "@/url";

const defaultForm = {
  introduction: '',
  email: '',
  number:'',
  headings:[''],
  descriptions:[''],     
};


const PrivacyPolicyAdmin=()=>{
  // Variables Declaration
    const [form, setForm] = useState(defaultForm);
        const [policy,setPolicy]=useState(null);
    
     useEffect(() => {
        axios.get(`${baseURL}/api/admin/get-policy/682e6778fb2ffba94269d8ce`)
            .then((res) => {
            setPolicy(res.data.message);
            })
            .catch((err) => {
            console.error('Failed to fetch policy:', err);
            });
        }, []); // ✅ Empty array ensures this runs only once

     useEffect(()=>{
            if (policy !== null) {
              setForm(policy);
            }
        },[policy])
        console.log(form);

  
      // Handles change of data in the form
      const handleChange = (e,index ) => {
        const { name, value } = e.target;
        if (["descriptions", "headings"].includes(name)) {
          setForm((prevForm) => {
            const updatedArray = [...prevForm[name]];
            updatedArray[index] = value;
            return { ...prevForm, [name]: updatedArray };
          });
          return;
        }
      
      
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
      };
      

      
      // handle submition of form i.e product is added to database
      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Started Updating Privacy Policy...")
      
        try {
          const response = await axios.post(`${baseURL}/api/admin/update-policy/682e6778fb2ffba94269d8ce`, form);
          if (response.status === 200 || response.status === 201) {
            alert('Privacy Policy Updated successfully!');
          } 
        } catch (error) {
          console.error('Error Updating Privacy Policy:', error);
          alert(error.response?.data?.message || 'An error occurred while Updating the user.');
        }
        console.log("Finished Updating Privacy Policy...")
      };
      
     
    

      
      console.log(form)
     
      
      
    return (
      (policy &&   <div className="w-full px-[2vw] py-[2vw] flex flex-col gap-[1vw] ">

                {/* All Attributes Section */}
                <div className=" shadow-adminShadow  p-[1vw] ">
                  {/* Basic Attributes */}
                  <div className="grid grid-cols-1 gap-[1vw] mb-[1.5vw] font-roboto">
                    <FormField type="textarea" label="Introduction Description" name="introduction" value={form.introduction} onChange={handleChange} />
                  
                     <div className="col-span-1">
                    {form.headings.map((value, index) => (
                    <div key={index} >
                    <label className="text-mediumText font-bold">{"Heading" } {index+1}</label>

                    <input type="text" name="headings" value={value || ''} onChange={(e) => handleChange(e, index)}
                        placeholder="Enter Heading"
                        className="w-full mt-[.5vw] py-[.75vw] px-[1vw] mb-[.75vw] bg-adminInputBoxColor text-regularText rounded-[.45vw] border"/>

                    <label className="text-mediumText font-bold">{"Description" } {index+1}</label>
                    <textarea  type="text" name="descriptions" value={form.descriptions[index] || ''} onChange={(e) => handleChange(e, index)}
                        placeholder="Enter Description"
                        className={`w-full mt-[.5vw] py-[.75vw] px-[1vw] ${index==form.headings.length-1?"mb-0":"mb-[1.5vw]"} bg-adminInputBoxColor text-regularText rounded-[.45vw] border`}/>
                    </div>

                    ))}
                    
                </div>
                <div className="flex gap-[16px]">
                  <button onClick={() => { setForm((prev) => ({ ...prev, headings: [...prev.headings, ''], descriptions: [...prev.descriptions, ''], }));}} className=" text-blue-500">
                    Add Point 
                    </button>
                    <button onClick={() => {setForm((prev) => ({...prev, headings: prev.headings.slice(0, -1), descriptions: prev.descriptions.slice(0, -1), }));}}className="ml-4 text-red-500">
                    Remove Last Point
                    </button>
                    
                </div>
                  </div>
                  
                   

                  
                  
                                  

                  <div className="grid grid-cols-2 gap-[1vw] mb-[1.5vw] font-roboto">
                    <FormField label="Support Email" name="email" value={form.email} onChange={handleChange} />
                    <FormField label="Support Phone Number" name="number" value={form.number} onChange={handleChange} />
                    
                  </div>

                
                  <button onClick={handleSubmit} className={`w-full mt-[1vw] py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700`}>
                      Update Privacy Policy
                  </button>

                </div>
                  
                

        </div>)
    )
}


export default PrivacyPolicyAdmin;

