import { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router';
import { baseURL } from "@/url";
import { FormField } from "@/components/ProductFields";

const ViewUser = () => {
     const { id } = useParams();
     console.log(id);
     const [userDetail,setUserDetails]=useState({});
     
     useEffect(()=>{
        if (!id) return; 
        console.log("started");
        axios.get(`${baseURL}/api/admin/get-user/${id}`, {
          withCredentials: true
        })
        .then((res) => {
          setUserDetails(res.data.message);
          console.log(res.data);
            })
        .catch((err) => {
          console.error('Failed to fetch products:', err);
        });
     },[id])
     console.log(userDetail);

    const handleChange = (e ) => {
        const { name, value } = e.target;

      };

  return (
    (userDetail && <div className="w-full px-[2vw] py-[2vw] flex flex-col gap-[1vw] ">
    
                    {/* All Attributes Section */}
                    <div className=" shadow-adminShadow  p-[1vw] ">
                      {/* Basic Attributes */}
                      <div className="grid grid-cols-2 gap-[1vw] mb-[1.5vw] font-roboto">
                        <FormField disable={true} label="Name" name="name" value={userDetail.name} onChange={handleChange} />
                        <FormField disable={true} label="Email" name="email" value={userDetail.email} onChange={handleChange} />
                        <FormField disable={true} label="Phone Number" name="number" value={userDetail.number} onChange={handleChange} />
                        <FormField disable={true} label="Role" name="role" value={userDetail.role} onChange={handleChange} />
                        
                        <div className="grid grid-cols-2 gap-[1vw]">
                          <FormField disable={true} label="State" name="state" value={userDetail.state} onChange={handleChange} />
                        <FormField disable={true} label="City" name="city" value={userDetail.city} onChange={handleChange} />
                        </div>
    
                        <FormField disable={true} label="Address" name="address" type="textarea" value={userDetail.address} onChange={handleChange} />
                        <FormField disable={true} label="Zipcode" name="zipcode" value={userDetail.zipcode} onChange={handleChange} />
                        <FormField disable={true} label="Gender" name="gender" value={userDetail.gender} onChange={handleChange}  />
                      </div>

                      
    
                    </div>
                      
                    
    
            </div>)
  )
}

export default ViewUser
