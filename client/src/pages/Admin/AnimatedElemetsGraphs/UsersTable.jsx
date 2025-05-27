import { formatINR } from '@/components/IntToPrice';
import { TransitionLink } from '@/Routes/TransitionLink';
import { useState } from 'react';
import axios from 'axios';
import { baseURL } from '@/url';

const Table = ({tableData, itemsPerPage, currentPage, setCurrentPage}) => {
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const handleBlockUser = async (userId, currentlyBlocked) => {
    try {
      const response = await axios.post(`${baseURL}/api/admin/toggle-block-user/${userId}`, {
        withCredentials: true
      });
      if (response.data.success) {
        // Refresh the page to update the table
        window.location.reload();
      }
    } catch (error) {
      console.error('Error toggling user block status:', error);
      alert('Failed to update user status');
    }
  };

  return (
    <div className="p-6">
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-2 border">UID</th>
            <th className="p-2 border">User Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone Number</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Orders</th>
            <th className="p-2 border">Status</th>
            <th className='p-2 border'>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item,index) => (
            <tr key={item._id} className="hover:bg-gray-100">
              <td className="p-2 border text-left">{index+1}</td>
              <td className="p-2 border">
                <TransitionLink to={`/Admin/view-user/${item._id}`}>
                  {item.name}
                </TransitionLink>
              </td>
              <td className="p-2 border text-left">{item.email}</td>
              <td className="p-2 border text-left">{item.number ? item.number : "not provided"}</td>
              <td className="p-2 border text-left">{item.role}</td>
              <td className="p-2 border text-left">{item.orders.length}</td>
              <td className="p-2 border text-left">
                <span className={item.blocked === "true" ? "text-red-600" : "text-green-600"}>
                  {item.blocked === "true" ? "Blocked" : "Active"}
                </span>
              </td>
              <td className="p-2 border text-center">
                {item.blocked === "true" ? (
                  <svg
                    onClick={() => handleBlockUser(item._id, item.blocked)}
                    className="w-[1.5vw] h-[1.5vw] cursor-pointer mx-auto text-red-600 hover:text-red-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C8.13401 2 5 5.13401 5 9V10C3.34315 10 2 11.3431 2 13V20C2 21.6569 3.34315 23 5 23H19C20.6569 23 22 21.6569 22 20V13C22 11.3431 20.6569 10 19 10V9C19 5.13401 15.866 2 12 2ZM15 10V9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9V10H15ZM5 12C4.44772 12 4 12.4477 4 13V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V13C20 12.4477 19.5523 12 19 12H5Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <svg
                    onClick={() => handleBlockUser(item._id, item.blocked)}
                    className="w-[1.5vw] h-[1.5vw] cursor-pointer mx-auto text-green-600 hover:text-green-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C8.13401 2 5 5.13401 5 9V10C3.34315 10 2 11.3431 2 13V20C2 21.6569 3.34315 23 5 23H19C20.6569 23 22 21.6569 22 20V13C22 11.3431 20.6569 10 19 10C19 5.13401 15.866 2 12 2ZM9 10C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9H9V10ZM4 13C4 12.4477 4.44772 12 5 12H19C19.5523 12 20 12.4477 20 13V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V13Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-6 space-x-2">
        <button 
          className="px-3 py-1 border rounded bg-gray-200" 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button 
            key={index} 
            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`} 
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button 
          className="px-3 py-1 border rounded bg-gray-200" 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
