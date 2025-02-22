import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router";
const adminDetails=[{
    username:"admin",
    password:"admin"
}]

const Admin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(username === adminDetails[0].username && password === adminDetails[0].password){
            console.log("Login Successful");
            navigate("/Admin/Dashboard");
        }else{
            setError("Invalid Credentials");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center text-teal-600 mb-8">
            Arora Opticals
          </h1>
            <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                    
                    type="text"
                    placeholder="username"
                    className="mt-2 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    id="username"
                    value={username}
                    onChange={(e) => {setUsername(e.target.value),setError("")}}
                    />
                </div>
        
                <div className="mb-4 relative">
                    <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="#" className="text-xs text-teal-500 hover:underline">
                        Forgot Password?
                    </a>
                    </div>
                    <div className="relative mt-2">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none pr-10"
                        id="password"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value),setError("")}}
                    />
                    <span
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </span>
                    </div>
                </div>
        
                <div className="flex items-center mb-6">
                    <input
                    type="checkbox"
                    id="keep-signed-in"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor="keep-signed-in" className="ml-2 text-sm text-gray-700">
                    Keep me signed in
                    </label>
                </div>
        
                <button  className="w-full bg-teal-500 text-white py-2 rounded-md font-semibold hover:bg-teal-600 transition">
                    Login
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
          
        </div>
      </div>
    )
}

export default Admin;