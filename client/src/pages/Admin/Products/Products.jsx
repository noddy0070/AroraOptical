import { useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import Table from "../AnimatedElemetsGraphs/ProductsTable";
import { TitleButton } from "@/components/button";
import SearchIcon2 from "../../../assets/images/icons/SearchIcon.svg";
import axios from "axios";
import { baseURL } from "@/url";


const Products = () => {
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const viewPerPage = [10, 25, 50];
  const inputRef = useRef(null);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const navigate = useNavigate();

  const handleChangeSearch = () => {
    const value = inputRef.current.value;
    setSearch(value);
    console.log(value);
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/api/admin/get-products`, {
        withCredentials: true,
      })
      .then((res) => {
        setProducts(res.data.products);
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, [productsPerPage, currentPage]);

  const deleteProduct = async (productIc) => {
    if (!window.confirm("Are you sure you want to delete this Product?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${baseURL}/api/admin/delete-product/${productIc}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Product deleted successfully!");
        axios
          .get(`${baseURL}/api/admin/get-products`, {
            withCredentials: true,
          })
          .then((res) => {
            setProducts(res.data.products);
          })
          .catch((err) => {
            console.error("Failed to fetch products:", err);
          });
      } else {
        alert("Failed to delete Product.");
      }
    } catch (error) {
      console.error("Error deleting Product:", error);
      alert("Server error while deleting Product.");
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);
      const response = await axios.get(
        `${baseURL}/api/admin/product-template`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const contentType =
        response.headers?.["content-type"] ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "product-template.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download template:", error);
      const status = error?.response?.status;
      const data = error?.response?.data;
      if (data instanceof Blob) {
        try {
          const text = await data.text();
          const parsed = JSON.parse(text);
          alert(parsed?.message || `Failed to download template (HTTP ${status})`);
          return;
        } catch {
          // fall through
        }
      }
      alert(
        status
          ? `Failed to download Excel template (HTTP ${status}).`
          : "Failed to download Excel template. Please try again."
      );
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  return (
    <div className="w-full px-[2.25vw] py-[2.25vw] flex flex-col gap-[5.5vw] font-roboto ">
      <div className="shadow-adminShadow w-full bg-white">
        <div className="flex  flex-row py-[1.5vw] px-[1.875vw] w-full  items-center   ">
          <p className="font-bold text-smallText">View</p>
          <div>
            <label className="text-smallText  font-bold ml-[1vw]"></label>
            <select
              name="category"
              value={productsPerPage}
              onChange={(e) => setProductsPerPage(Number(e.target.value))}
              className=" py-[.25vw] px-[.5vw] border-black rounded-[4px] text-regularText border"
            >
              {viewPerPage.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className=" flex flex-row ml-[4vw] gap-[2vw] md:gap-[.5vw]  w-[26.875vw]  items-center text-gray-600 font-roboto font-bold text-[14px] md:text-smallText h-[12vw] md:h-[3vw] px-[3vw] md:px-[.75vw] rounded-[10vw] md:rounded-[2.5vw] border-[1px] md:shadow-[0px_2px_4px_rgba(0,_0,_0,_0.25)] shadow-[0px_2px_10px_rgba(0,_0,_0,_0.25)]">
            <img
              className="w-[6vw] md:w-[1.75vw] h-[6vw]  md:h-[1.75vw]"
              src={SearchIcon2}
            />
            <input
              className=" focus:outline-none "
              type="text"
              defaultValue="Search Here"
              ref={inputRef}
              onChange={handleChangeSearch}
              onFocus={(e) => {
                if (e.target.value === "Search Here") {
                  e.target.value = "";
                }
              }}
              onBlur={(e) => {
                if (e.target.value.trim() === "") {
                  e.target.value = "Search Here";
                }
              }}
            />
          </div>
          <div className="ml-auto">
            <TitleButton
              onClick={() => setIsAddProductModalOpen(true)}
              btnHeight={4.25}
              btnRadius={3}
              btnWidth={16}
              btnTitle={"Add Product +"}
            />
          </div>
        </div>

        <Table
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={productsPerPage}
          tableData={products}
          deleteProduct={deleteProduct}
        />
      </div>

      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="absolute inset-0"
            onClick={() => setIsAddProductModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[32rem] rounded-lg bg-white shadow-xl p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add Product</h2>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <button
                className="w-full py-3 rounded-md bg-black text-white font-semibold hover:bg-gray-800 transition"
                onClick={() => {
                  setIsAddProductModalOpen(false);
                  navigate("/Admin/add-product");
                }}
              >
                Add Product Manually
              </button>

              <button
                className="w-full py-3 rounded-md border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition"
                onClick={() => {
                  setIsAddProductModalOpen(false);
                  navigate("/Admin/products/bulk-upload");
                }}
              >
                Upload Products From Excel
              </button>
            </div>

            <div className="border-t pt-4 mt-2 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Need a sample file? Download the Excel template.
              </p>
              <button
                className="px-4 py-2 rounded-md border border-gray-300 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-60"
                onClick={handleDownloadTemplate}
                disabled={isDownloadingTemplate}
              >
                {isDownloadingTemplate
                  ? "Downloading..."
                  : "Download Excel Template"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;