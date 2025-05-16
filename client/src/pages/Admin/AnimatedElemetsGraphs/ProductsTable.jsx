import { TransitionLink } from '@/Routes/TransitionLink';
import { useState } from 'react';



const Table = ({tableData,itemsPerPage,currentPage,setCurrentPage}) => {
  

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
  const filteredProducts = tableData.filter(product => {
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
  console.log("totalPage",totalPages);
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
            <th className="p-2 border">Model Code</th>
            <th className="p-2 border">Model Name</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Brand</th>
            <th className="p-2 border">Shape</th>
            <th className='p-2 border'>MRP</th>
            <th className="p-2 border">Order</th>
            {/* <th className="p-2 border cursor-pointer" onClick={() => handleSort('price')}>Price</th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort('stock')}>Stock</th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort('rating')}>Rating</th> */}
            {/* <th className="p-2 border">Order</th> */}
            {/* <th className="p-2 border">Sales</th> */}
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
              <td className="p-2 border text-left">{product.modelValue}</td>
              <td className="p-2 border text-left">{product.category}</td>
              {/* <td className="p-2 border text-left">${product.price.toFixed(2)}</td>
              <td className="p-2 border text-left">{product.stock}</td>
              <td className="p-2 border text-left">⭐ {product.rating.toFixed(1)}</td>\ */}
              <td className="p-2 border text-left">{product.brand}</td>
              <td className="p-2 border text-left">{product.shape}</td>
              <td className="p-2 border text-left">{product.price}</td>
              <td className="p-2 border text-left">{product.order}</td>
              <td className="p-2 border text-left">{product.order}</td>
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
