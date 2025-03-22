import { useState } from 'react';



const Table = () => {
  const productsData = [
    { uid: '#1', product: 'Tops and skirt set for Female', category: 'womans', brand: 'richman', price: 19.00, stock: 30, rating: 4.9, order: 380, sales: '$38k' },
    { uid: '#2', product: "Leather belt Steve Madden men's", category: 'mans', brand: 'lubana', price: 14.00, stock: 23, rating: 4.5, order: 189, sales: '$9k' },
    { uid: '#3', product: 'Existing product name', category: 'womans', brand: 'ecstasy', price: 33.00, stock: 30, rating: 4.1, order: 380, sales: '$38k' },
    { uid: '#4', product: 'Existing product name', category: 'kidz', brand: 'ecstasy', price: 33.00, stock: 30, rating: 4.4, order: 380, sales: '$38k' },
    { uid: '#5', product: 'Existing product name', category: 'accessory', brand: 'ecstasy', price: 33.00, stock: 30, rating: 5.0, order: 380, sales: '$38k' },
  ];

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('ascending');

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
    setSortConfig({ key, direction });
  };

  const filteredProducts = productsData.filter(product => {
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
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Brand</th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort('price')}>Price</th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort('stock')}>Stock</th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort('rating')}>Rating</th>
            <th className="p-2 border">Order</th>
            <th className="p-2 border">Sales</th>
            <th className=''>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.uid} className="hover:bg-gray-100">
              <td className="p-2 border text-left">{product.uid}</td>
              <td className="p-2 border">{product.product}</td>
              <td className="p-2 border text-left">{product.category}</td>
              <td className="p-2 border text-left">{product.brand}</td>
              <td className="p-2 border text-left">${product.price.toFixed(2)}</td>
              <td className="p-2 border text-left">{product.stock}</td>
              <td className="p-2 border text-left">⭐ {product.rating.toFixed(1)}</td>
              <td className="p-2 border text-left">{product.order}</td>
              <td className="p-2 border text-left">{product.sales}</td>
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
