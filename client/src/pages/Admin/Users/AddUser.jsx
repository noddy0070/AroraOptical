import {useState,useEffect} from "react";
import { Categories } from './../../../data/glassesInformationData'
import axios from "axios";
import { State, City } from "country-state-city";
import { FormField } from "@/components/ProductFields";
import { baseURL } from "@/url";

const defaultForm = {
  name: '',
  email: '',
  number:'',
  role:'',
  state:'',
  city: '',
  gender: '',
  password: '',
  address: '',
  zipcode: '',      
};


const AddUser=()=>{
  // Variables Declaration
    const [form, setForm] = useState(defaultForm);
    // Code for City and State Dropdown
     const defaultCountryCode = "IN"; // India
     const [states, setStates] = useState([]);
     const [cities, setCities] = useState([]);
   
     const [selectedState, setSelectedState] = useState("");
     const [selectedCity, setSelectedCity] = useState("");
   
     useEffect(() => {
       setStates(State.getStatesOfCountry(defaultCountryCode));
     }, []);
   
     useEffect(() => {
       if (selectedState) {
         setCities(City.getCitiesOfState(defaultCountryCode, selectedState));
         setSelectedCity("");
       }
     }, [selectedState]);


  
      // Handles change of data in the form
      const handleChange = (e ) => {
        const { name, value } = e.target;
      
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
      };
      

      
      // handle submition of form i.e product is added to database
      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Started adding user...")
      
        try {
          const response = await axios.post(`${baseURL}/api/admin/add-user`, form, {
            withCredentials: true
          });
          if (response.status === 200 || response.status === 201) {
            alert('User added successfully!');
            setForm(defaultForm);
          } 
        } catch (error) {
          console.error('Error Adding User:', error);
          alert(error.response?.data?.message || 'An error occurred while adding the user.');
        }
        console.log("Finished Adding User...")
      };
      
     
    

      
      console.log(form)
     
      
      
    return (
        <div className="w-full px-[2vw] py-[2vw] flex flex-col gap-[1vw] ">

                {/* All Attributes Section */}
                <div className=" shadow-adminShadow  p-[1vw] ">
                  {/* Basic Attributes */}
                  <div className="grid grid-cols-2 gap-[1vw] mb-[1.5vw] font-roboto">
                    <FormField label="Name" name="name" value={form.name} onChange={handleChange} />
                    <FormField label="Email" name="email" value={form.email} onChange={handleChange} />
                    <FormField label="Phone Number" name="number" value={form.number} onChange={handleChange} />
                    <FormField label="Role" name="role" value={form.role} onChange={handleChange} options={['admin','user']} />
                    
                    <div className="grid grid-cols-2 gap-[1vw]">
                      <div>
                       <label className="text-mediumText font-bold">State</label>
                      <select className="w-full mt-[.5vw] py-[.75vw] px-[1vw] bg-adminInputBoxColor text-regularText rounded-[.45vw] border" name="state" id="state"
                              value={selectedState} onChange={(e) => {setSelectedState(e.target.value),handleChange(e)}}>
                              <option value="">Select State</option>
                              {states.map((state) => (
                                  <option key={state.isoCode} value={state.isoCode}>
                                  {state.name}
                                  </option>
                              ))}
                          </select>
                      </div>
                      <div>
                          <label className="text-mediumText font-bold">City</label>
                          <select className="w-full mt-[.5vw] py-[.75vw] px-[1vw] bg-adminInputBoxColor text-regularText rounded-[.45vw] border" name="city" value={selectedCity} id="city"
                            onChange={(e) => {setSelectedCity(e.target.value), handleChange(e)}} disabled={!selectedState}>
                            <option value="">Select City</option>
                            {cities.map((city, idx) => (
                                <option key={idx} value={city.name}>
                                {city.name}
                                </option>
                            ))}
                            </select>
                      </div>
                    </div>

                    <FormField label="Address" name="address" type="textarea" value={form.address} onChange={handleChange} />
                    <FormField label="Zipcode" name="zipcode" value={form.zipcode} onChange={handleChange} />
                    <FormField label="Gender" name="gender" value={form.gender} onChange={handleChange} options={["Male","Female","Other"]} />
                    <FormField label="Password" name="password" value={form.password} onChange={handleChange} />
                    
                  </div>

                  <button onClick={handleSubmit} className={`w-full mt-[1vw] py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700`}>
                      Add User
                  </button>

                </div>
                  
                

        </div>
    )
}


export default AddUser;

