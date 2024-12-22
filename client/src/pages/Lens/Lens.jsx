import lensTypeImg from '../../assets/images/lensPage/lensType.png';
import lensCoatingImg from '../../assets/images/lensPage/lensCoating.png';
import lensThicknessImg from '../../assets/images/lensPage/lensThickness.png';
import prescriptionImg from '../../assets/images/lensPage/prescription.png';

import {useState,useEffect} from 'react';

export default function Lens() {
    const [focusedTopPosition, setFocusedTopPosition] = useState(0);
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
    
      // Set the initial position of #focused
      useEffect(() => {
        const initialPosition = calculatePosition("lensType");
        setFocusedTopPosition(initialPosition);
      }, []);
    
      // Handle clicks on other elements
      const handleFocus = (id) => {
        const newPosition = calculatePosition(id);
        setFocusedTopPosition(newPosition);
      };
      
    return (
        <section className="h-screen flex flex-row bg-white-100">
            <div className="relative h-full w-[16.1875vw] bg-darkslategrey  gap-[2vw]">    
            <div className='absolute left-[75%] flex flex-col pt-[5.5vw] items-center gap-[2vw]'>
      <div
        id='lensType'
        className='z-[2] w-[7.875vw] h-[7.875vw] cursor-pointer flex flex-col items-center justify-center bg-white rounded-full'
        onClick={() => handleFocus('lensType')}
      >
        <img className='w-[5.9375vw] h-[5.9375vw]' src={lensTypeImg} />
      </div>
      <div
        id='lensCoating'
        className='z-[2] w-[7.875vw] h-[7.875vw] cursor-pointer flex flex-col items-center justify-center bg-white rounded-full'
        onClick={() => handleFocus('lensCoating')}
      >
        <img className='w-[5.9375vw] h-[5.9375vw]' src={lensCoatingImg} />
      </div>
      <div
        id='lensThickness'
        className='z-[2] w-[7.875vw] h-[7.875vw] cursor-pointer flex flex-col items-center justify-center bg-white rounded-full'
        onClick={() => handleFocus('lensThickness')}
      >
        <img className='w-[5.9375vw] h-[5.9375vw]' src={lensThicknessImg} />
      </div>
      <div
        id='prescription'
        className='z-[2] w-[7.875vw] h-[7.875vw] cursor-pointer flex flex-col items-center justify-center bg-white rounded-full'
        onClick={() => handleFocus('prescription')}
      >
        <img className='w-[5.9375vw] h-[5.9375vw]' src={prescriptionImg} />
      </div>
      <div
        id='focused'
        className='absolute w-[9.25vw] h-[9.25vw] flex flex-col items-center justify-center bg-darkslategrey rounded-full transition-all ease-in-out duration-500 transform'
        style={{ top: `${focusedTopPosition}px` }}
      ></div>
    </div>
                </div>

            <div className="h-full w-[83.8125vw]">

            </div>
        </section>
    )
}
