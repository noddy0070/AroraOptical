import { useNavigate } from "react-router";
import { useState,useRef,useEffect } from "react";
import Table from "../AnimatedElemetsGraphs/ProductsTable";
import { TitleButton } from "@/components/button";
import SearchIcon2 from '../../../assets/images/icons/SearchIcon.svg'
import axios from "axios";


const Products=()=>{
    const [productsPerPage, setProductsPerPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const viewPerPage=[1,2,3]
    const inputRef = useRef(null);
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);

    const handleChangeSearch = () => {
      const value = inputRef.current.value; // Access the input value through the ref
      setSearch(value); // Update the state with the input value
      console.log(search);
    };


    useEffect(() => {
        axios.get(`http://localhost:3000/api/admin/get-products`)
          .then((res) => {
            setProducts(res.data.products);
            console.log(res.data);
          })
          .catch((err) => {
            console.error('Failed to fetch products:', err);
          });
      }, [productsPerPage,currentPage]);
      
    const navigate = useNavigate();
    console.log(products);
    // console.log(productsPerPage);
    return(
        <div className="w-full px-[2.25vw] py-[2.25vw] flex flex-col gap-[5.5vw] font-roboto">
            <div className="shadow-adminShadow w-full">
                <div className="flex  flex-row py-[1.5vw] px-[1.875vw] w-full  items-center   ">
                    <p className="font-bold text-smallText">View</p>
                    <div>
                    <label className="text-smallText  font-bold ml-[1vw]"></label>
                                <select name="category" value={productsPerPage} onChange={(e)=>setProductsPerPage(e.target.value)} className=" py-[.25vw] px-[.5vw] border-black rounded-[4px] text-regularText border">
                                {viewPerPage.map((category) => (
                                <option key={category} value={category}>{category}</option>
                                ))}
                                </select>
                                </div>
                    <div className=' flex flex-row ml-[4vw] gap-[2vw] md:gap-[.5vw]  w-[26.875vw]  items-center text-gray-600 font-roboto font-bold text-[14px] md:text-smallText h-[12vw] md:h-[3vw] px-[3vw] md:px-[.75vw] rounded-[10vw] md:rounded-[2.5vw] border-[1px] md:shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] shadow-[0px_2px_10px_rgba(0,_0,_0,_0.25)]'>
                                        <img className='w-[6vw] md:w-[1.75vw] h-[6vw]  md:h-[1.75vw]' src={SearchIcon2}/>
                                        <input className=' focus:outline-none ' type="text" defaultValue="Search Here" ref={inputRef} onChange={handleChangeSearch} 
                                        onFocus={(e) => {if (e.target.value === 'Search Here') {e.target.value = '';}}}
                                        onBlur={(e) => { if (e.target.value.trim() === '') {e.target.value = 'Search Here';}}}/>
                                      </div>
                    <div className="ml-auto"> 
                    <TitleButton  onClick={()=>navigate('/Admin/add-product')} btnHeight={4.25} btnRadius={3} btnWidth={16}  btnTitle={"Add Product +"}/> 
                    </div>
                </div>

                <Table currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={productsPerPage} tableData={products}  />
                </div>
        </div>
    )
}

export default Products;