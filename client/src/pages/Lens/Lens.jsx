import lensTypeImg from '../../assets/images/lensPage/lensType.png';
import lensCoatingImg from '../../assets/images/lensPage/lensCoating.png';
import lensThicknessImg from '../../assets/images/lensPage/lensThickness.png';
import prescriptionImg from '../../assets/images/lensPage/prescription.png';
import {useState,useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LensType from './LensType';
import LensCoating from './LensCoating';
import LensThickness from './LensThickness';
import Prescription from './Prescription';
import PrescriptionForm from './PrescriptionForm';
import SavedPrescription from './SavedPrescription';
import BlueFilterLens from './BlueFilterLens';
import LensTint from './LensTint';
import axios from 'axios';
import { baseURL } from '@/url';
import { useSelector } from 'react-redux';

const lensData=[{id:'lensType',img:lensTypeImg},{id:'lensCoating',img:lensCoatingImg},{id:'lensThickness',img:lensThicknessImg},{id:'prescription',img:prescriptionImg}];

export default function Lens() {
  const navigate = useNavigate();
  const location = useLocation();
  const productId=location.pathname.split('/')[2];

  const {user} = useSelector((state) => state.auth);
  const [amount, setAmount] = useState(0);
  const [focusedTopPosition, setFocusedTopPosition] = useState(null);  
  const [focused, setFocused] = useState("lensType");
  const [subFocusedCoating,setSubFocusedCoating]=useState("");
  const [subFocusedPrescription,setSubFocusedPrescription]=useState("");
  const [product,setProduct]=useState(null);


  const [form,setForm]=useState({
    lensType:"",
    lensCoating:"",
    lensThickness:"",
    prescriptionId:"",
  });

  const calculatePosition = (id) => {
    const element = document.getElementById(id);
    const focusedElement = document.getElementById("focused");
    if (element && focusedElement) {
      const elementRect = element.getBoundingClientRect(); // Target element position
      const parentRect = element.parentElement.getBoundingClientRect(); // Parent container position
      const elementCenter = elementRect.top - parentRect.top + elementRect.height / 2; // Center of the element
      const adjustment = focusedElement.offsetHeight / 2; // Adjust for the height of #focused
      return elementCenter - adjustment; // Final position
    }
    return 0;
  };
  useEffect(()=>{
    fetchProductDetails();
  },[]);
  const fetchProductDetails = async () => {
    // Lens flow should use public product details endpoint
    const response = await axios.get(`${baseURL}/api/product/${productId}`);
    setProduct(response.data);
    setAmount(response.data.price);
  }
  // Set the initial position of #focused
  useEffect(() => {
    const initialPosition = calculatePosition("lensType");
    setFocusedTopPosition(initialPosition);
  }, []);

  // Handle clicks on other elements
  const handleFocus = (id) => {
    // Calculate the position of the new focused element

    if(id==="lensCoating" &&( subFocusedCoating==="lensTint"||subFocusedCoating==="blueFilter")){
      setSubFocusedCoating("");
    }

    if(id==="prescription" && subFocusedPrescription==="newPrescription"){
      setSubFocusedPrescription("");
    }

    const newPosition = calculatePosition(id);
    setFocusedTopPosition(newPosition);
    setFocused(id); // Set the currently focused element instantly
    setTimeout(() => {
      setSubFocusedCoating("");
    }, 700);

  };


  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    let resizeFrame;

    const handleResize = () => {
      // Set `isResizing` to true when resize starts
      if (!isResizing) {
        setIsResizing(true);
      }

      // Use `requestAnimationFrame` to detect when resizing stops
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        setIsResizing(false);

      });
      setTimeout(() => {
        setFocusedTopPosition(calculatePosition(focused));
      }, 500);
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, [isResizing]);

  const isDisabled = (id) => {
    if(id==="lensType"){
      return false;
    }
    if(id==="lensCoating" && form.lensType===""){
      return true;
    }
    if(id==="lensThickness" && form.lensType==="" && form.lensCoating===""){
      return true;
    }
    if(id==="prescription" && form.lensType==="" && form.lensCoating==="" && form.lensThickness===""){
      return true;
    }
    return true;
  }

  const addProductToCart = async (updatedFormData = form, updatedAmount = amount) => {
    try {
      const response = await axios.post(`${baseURL}/api/user/cart/add`, {
          userId: user._id,
          productId: productId,
          quantity: 1,
          lensType: updatedFormData.lensType,
          lensCoating: updatedFormData.lensCoating,
          lensThickness: updatedFormData.lensThickness,
          prescriptionId: updatedFormData.prescriptionId,
          totalAmount: updatedAmount
      }, {
          withCredentials: true
      });

      if (response.data.success) {
          // Show success message or update UI
          alert('Product added to cart successfully!');
          // Dispatch custom event for cart update
          window.dispatchEvent(new CustomEvent('cartUpdated'));
          navigate('/cart');
      }
  } catch (error) {
      console.error('Add to cart error:', error);
  }
  }
      
    return (
        <section className="min-h-screen flex flex-col md:flex-row bg-white-100 overflow-hidden">
            {/* Mobile: Horizontal Navigation */}
            <div className="md:hidden w-full bg-darkslategrey py-[4vw] px-[5vw] overflow-x-auto hide-scrollbar">
              <div className="flex flex-row gap-[4vw] items-center justify-center min-w-max">
                {lensData.map((item) => (
                  <button
                    key={item.id}
                    id={item.id}
                    className={`z-[2] w-[20vw] h-[20vw] min-w-[20vw] flex flex-col items-center justify-center bg-white rounded-full ${focused === item.id ? 'ring-4 ring-darkslategrey' : ''}`}
                    disabled={isDisabled(item.id)}  
                    onClick={() =>{handleFocus(item.id);
                      if(item.id==="lensType"){
                        setAmount(product.price);
                      }
                    }}
                  >
                    <img className="w-[15vw] h-[15vw]" src={item.img} />
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: Vertical Sidebar */}
            <div className="hidden md:block relative w-[16.1875vw] bg-darkslategrey z-10 gap-[2vw]">    
              <div className="absolute left-[75%] flex flex-col pt-[5.5vw] items-center gap-[2vw]">
                {lensData.map((item) => (
                  <button
                    key={item.id}
                    id={item.id}
                    className={`z-[2] w-[7.875vw] h-[7.875vw] flex flex-col items-center justify-center bg-white rounded-full`}
                    disabled={isDisabled(item.id)}  
                    onClick={() =>{handleFocus(item.id);
                      if(item.id==="lensType"){
                        setAmount(product.price);
                      }
                    }}
                  >
                    <img className="w-[5.9375vw] h-[5.9375vw]" src={item.img} />
                  </button>
                ))}
                <div
                  id="focused"
                  className={`absolute w-[9.25vw] h-[9.25vw] flex flex-col items-center justify-center bg-darkslategrey rounded-full transition-all ease-in-out duration-500 transform`}
                  style={{ top: `${focusedTopPosition}px` }}
                />
              </div>
            </div>

            <div className="relative w-full md:w-[83.8125vw] flex flex-col items-center">
              <button 
                onClick={() => navigate(-1)}
                className='w-[10vw] md:w-[2.5vw] h-[10vw] md:h-[2.5vw] absolute z-[100] top-[3vw] md:top-[2.8125vw] right-[5vw] md:right-[2.1875vw] cursor-pointer shadow-[0px_1vw_1vw_rgba(0,_0,_0,_0.25)] md:shadow-[0px_.25vw_.25vw_rgba(0,_0,_0,_0.25)] border-[1px] border-white bg-[#CECECE] rounded-full'
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="p-[2vw] md:p-[.5vw] text-white rounded-cross-icon">
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>
</div>
              <div className="relative w-full mt-[6vw] md:mt-[3vw] h-auto md:h-[28.625vw]">
            <div className="relative h-auto md:h-[28.625vw]">
            {/* Mobile: Show current step only */}
            <div className="md:hidden w-full">
              {focused === "lensType" && (
                <LensType form={form} setForm={setForm} handleFocus={handleFocus} amount={amount} setAmount={setAmount}/>
              )}
              {focused === "lensCoating" && subFocusedCoating === "" && (
                <LensCoating form={form} setForm={setForm} handleFocus={handleFocus} amount={amount} setAmount={setAmount} subFocusedCoating={subFocusedCoating} setSubFocusedCoating={setSubFocusedCoating} />
              )}
              {focused === "lensCoating" && subFocusedCoating === "lensTint" && (
                <LensTint form={form} setForm={setForm} handleFocus={handleFocus} amount={amount} setAmount={setAmount} />
              )}
              {focused === "lensCoating" && subFocusedCoating === "blueFilter" && (
                <BlueFilterLens form={form} setForm={setForm} handleFocus={handleFocus} amount={amount} setAmount={setAmount} />
              )}
              {focused === "lensThickness" && (
                <LensThickness form={form} setForm={setForm} handleFocus={handleFocus} amount={amount} setAmount={setAmount} addProductToCart={addProductToCart} />
              )}
              {focused === "prescription" && subFocusedPrescription === "" && (
                <Prescription form={form} setForm={setForm} handleFocus={handleFocus} setSubFocusedPrescription={setSubFocusedPrescription} />
              )}
              {focused === "prescription" && subFocusedPrescription === "newPrescription" && (
                <PrescriptionForm form={form} setForm={setForm} handleFocus={handleFocus} setSubFocusedPrescription={setSubFocusedPrescription} />
              )}
              {focused === "prescription" && subFocusedPrescription === "savedPrescription" && (
                <SavedPrescription form={form} setForm={setForm} handleFocus={handleFocus} amount={amount} addProductToCart={addProductToCart} setSubFocusedPrescription={setSubFocusedPrescription} />
              )}
            </div>

            {/* Desktop: Animated transitions */}
            <div className="hidden md:block">
            <div
              className="relative transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateY(-${
                  focused === "lensType"
                    ? "0"
                    : focused === "lensCoating"
                    ? "100vh"
                    : focused === "lensThickness"
                    ? "200vh"
                    : "300vh"
                }) ` ,
              }}
            >
              <div className="absolute w-full h-[100vh] top-0">
                <LensType form={form} setForm={setForm} handleFocus={handleFocus} amount={amount} setAmount={setAmount}/>
              </div>
              <div className="absolute w-full h-[100vh] top-[100vh] left-0 transform transition-all duration-700" style={{left:subFocusedCoating=="lensTint" || subFocusedCoating=="blueFilter"?"-100vw":"0"}}>
                <LensCoating form={form} setForm={setForm} handleFocus={handleFocus} amount={amount} setAmount={setAmount} subFocusedCoating={subFocusedCoating} setSubFocusedCoating={setSubFocusedCoating} />
              </div>
              <div className='absolute w-full h-[28.625vw] top-[100vh] transform transition-all duration-700' style={{ left:subFocusedCoating=="lensTint"?"-0vw":"100vw"}}>
                <LensTint form={form} setForm={setForm} handleFocus={handleFocus} amount={amount} setAmount={setAmount} />
              </div>
              <div className='absolute w-full h-[28.625vw] top-[100vh] transform transition-all duration-700' style={{left:subFocusedCoating=="blueFilter"?"-0vw":"100vw"}}>
                <BlueFilterLens form={form} setForm={setForm} handleFocus={handleFocus} amount={amount} setAmount={setAmount} />
              </div>
              <div className="absolute w-full h-[100vh] top-[200vh]">
                <LensThickness form={form} setForm={setForm} handleFocus={handleFocus} amount={amount} setAmount={setAmount} addProductToCart={addProductToCart} />
              </div>
             
              <div className="absolute w-full h-[100vh] top-[300vh]  left-0  transform transition-all duration-700"  style={{left:subFocusedPrescription=="newPrescription"||subFocusedPrescription=="savedPrescription"?"-100vw":"0vw"}}>
              <Prescription form={form} setForm={setForm} handleFocus={handleFocus} setSubFocusedPrescription={setSubFocusedPrescription} />
              </div>

              <div className="absolute w-full h-[100vh] top-[300vh]  transform transition-all duration-700" style={{left:subFocusedPrescription=="newPrescription"?"-0vw":"100vw"}}>
                <PrescriptionForm form={form} setForm={setForm} handleFocus={handleFocus} setSubFocusedPrescription={setSubFocusedPrescription} />
              </div>
              <div className="absolute w-full h-[100vh] top-[300vh]  transform transition-all duration-700" style={{left:subFocusedPrescription=="savedPrescription"?"-0vw":"100vw"}}>
              <SavedPrescription form={form} setForm={setForm} handleFocus={handleFocus} amount={amount}
              addProductToCart={addProductToCart} setSubFocusedPrescription={setSubFocusedPrescription} />
                </div>
            </div>
          </div>
          </div>        
            </div>
              
              
        </section>
    )
}
