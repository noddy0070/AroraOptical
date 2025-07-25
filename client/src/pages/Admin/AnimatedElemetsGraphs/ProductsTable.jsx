import { formatINR } from '@/components/IntToPrice';
import { TransitionLink } from '@/Routes/TransitionLink';
import { useState } from 'react';



const Table = ({tableData,itemsPerPage,currentPage,setCurrentPage,deleteProduct}) => {
  

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('ascending');

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    setSortConfig({ key, direction });
  };
  console.log("tableData",tableData);
  const filteredProducts = tableData?.filter(product => {
    return (
      (selectedBrand ? product.brand === selectedBrand : true) &&
      (selectedCategory ? product.category === selectedCategory : true)
    );
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortConfig.key) {
      const direction = sortConfig.direction === 'ascending' ? 1 : -1;
      if (a[sortConfig.key] < b[sortConfig.key]) return -1 * direction;
      if (a[sortConfig.key] > b[sortConfig.key]) return 1 * direction;
    }
    return 0;
  });

  


  const finalSortedProducts = sortOrder === 'ascending' ? sortedProducts : [...sortedProducts].reverse();
  console.log("final", finalSortedProducts)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = finalSortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(finalSortedProducts.length / itemsPerPage);


  return (
    <div className="p-6">
      <div className="flex space-x-4 mb-4">
        <select className="p-2 border rounded" onChange={(e) => handleSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="stock">Stock</option>
          <option value="order">Order</option>
        </select>

        <select className="p-2 border rounded" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>

        <select className="p-2 border rounded" onChange={(e) => setSelectedBrand(e.target.value)}>
          <option value="">Filter by Brand</option>
          <option value="richman">Richman</option>
          <option value="lubana">Lubana</option>
          <option value="ecstasy">Ecstasy</option>
        </select>

        <select className="p-2 border rounded" onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Filter by Category</option>
          <option value="womans">Womans</option>
          <option value="mans">Mans</option>
          <option value="kidz">Kidz</option>
          <option value="accessory">Accessory</option>
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-2 border">UID</th>
            <th className="p-2 border">Model Name</th>
            <th className="p-2 border">Model Code</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Brand</th>
            <th className="p-2 border">MRP</th>
            <th className='p-2 border'>Discounted Price</th>
            <th className="p-2 border">Order</th>
            <th className=''>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product,index) => (
            <tr key={product.uid} className="hover:bg-gray-100">
              <td className="p-2 border text-left">{index+1}</td>
              <td className="p-2 border">
                <TransitionLink to={`/product/${product._id}`} >
                {product.modelName}
                </TransitionLink>
                </td>
              <td className="p-2 border text-left">{product.modelCode}</td>
              <td className="p-2 border text-left">{product.category}</td>
              <td className="p-2 border text-left">{product.brand}</td>
              <td className="p-2 border text-left">{formatINR(product.price)}</td>
              <td className="p-2 border text-left">{formatINR(product.discount)}</td>
              <td className="p-2 border text-left">{product.orders}</td>
              <td className="py-2  border text-left">
                <div key={index} className='flex justify-center gap-[.625vw] items-center'>                
                    <TransitionLink to={`/product/${product._id}`}>
                      <svg 
                        className='w-[1.5vw] h-[1.5vw] cursor-pointer text-blue-600 hover:text-blue-700 transition-colors duration-200' 
                        viewBox="0 0 24 18" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M1 9C1 9 5 1 12 1C19 1 23 9 23 9C23 9 19 17 12 17C5 17 1 9 1 9Z" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        <path 
                          d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </TransitionLink>

                    <TransitionLink to={`/Admin/edit-product/${product._id}`}>
                      <svg   
                        className='w-[1.5vw] h-[1.5vw] cursor-pointer text-amber-600 hover:text-amber-700 transition-colors duration-200' 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M12 20H21M16.5 3.49998C16.8978 3.10216 17.4374 2.87866 18 2.87866C18.2786 2.87866 18.5544 2.93353 18.8118 3.04014C19.0692 3.14674 19.303 3.303 19.5 3.49998C19.697 3.69697 19.8532 3.93082 19.9598 4.18819C20.0665 4.44556 20.1213 4.72141 20.1213 4.99998C20.1213 5.27856 20.0665 5.55441 19.9598 5.81178C19.8532 6.06915 19.697 6.303 19.5 6.49998L7 19L3 20L4 16L16.5 3.49998Z" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </TransitionLink>

                    <svg 
                      onClick={()=>deleteProduct(product._id)} 
                      className='w-[1.5vw] h-[1.5vw] cursor-pointer text-red-600 hover:text-red-700 transition-colors duration-200' 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M3 6H5H21" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      <path 
                        d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      <path 
                        d="M10 11V17" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      <path 
                        d="M14 11V17" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                </div>
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
