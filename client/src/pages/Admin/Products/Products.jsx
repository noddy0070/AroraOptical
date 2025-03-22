import { useNavigate } from "react-router";
import Table from "../AnimatedElemetsGraphs/ProductsTable";

const Products=()=>{
    const navigate = useNavigate();
    return(
        <div className="w-full px-[2vw] py-[3vw] flex flex-col gap-[2vw] bg-bgCreamWhite">
                <div className="flex flex-row justify-between p-[1vw] items-center text-adminFontColor1 shadow-[0px_0.55vw_2.2vw_rgba(51,_38,_174,_.2)] rounded-[1.1vw] ">
                    <h2 className="font-bold">Products List</h2>
                    <button className="text-regularText font-roboto font-medium " onClick={()=>navigate('/Admin/Dashboard/add-product')}>Add Product </button>
                </div>
                <div className="grid grid-cols-3 justify-between text-white font-bold gap-[1vw]">
                    <div className="bg-blue-500 p-[1vw] rounded-[1vw] shadow-[0px_0.55vw_2.2vw_rgba(51,_38,_174,_.2)]">
                        <h4 className="text-h4Text">{"500"}</h4>
                        <h6 className="text-h6Text">Total Products</h6>
                    </div>
                    <div className="bg-purple-500 p-[1vw] rounded-[1vw] shadow-[0px_0.55vw_2.2vw_rgba(51,_38,_174,_.2)]">
                        <h4 className="text-h4Text">{"500"}</h4>
                        <h6 className="text-h6Text">Total Categories</h6>
                    </div>
                    <div className="bg-green-500 p-[1vw] rounded-[1vw] shadow-[0px_0.55vw_2.2vw_rgba(51,_38,_174,_.2)]">
                        <h4 className="text-h4Text">{"500"}</h4>
                        <h6 className="text-h6Text">Total Brands</h6>
                    </div>
                </div>
                <Table/>
        </div>
    )
}

export default Products;