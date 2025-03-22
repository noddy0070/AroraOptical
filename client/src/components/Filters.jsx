import TickIcon from '../assets/images/icons/tick_icon.png'
import {useState} from 'react';
import { TransitionLink } from '../Routes/TransitionLink';
const audienceForFilter={All:'Everyone',Men:"Men",Women:"Women",Kids:"Kids"}
const brands=['Safflio','Luxotiica','Indian']
// const shapes=['Rectangular','Square','Round','Oval','Aviator','Cat-Eye','Geometric','Hexagonal']
// const frameType=['Full Rim','Half Rim','Rimless']
// const frameMaterial=['Acetate','Metal','T.R.','Titanium']
// const color=['Black','Brown','Havana','Golden','Dual Tone','Grey']
// const size=['Medium(51-54mm)','Small(50mm or less)','Large(55mm or more)']

import {Size as size, Colors as color, Material as frameMaterial, Type as frameType, Shape as shapes} from '../data/glassesInformationData'


 export default  function Filters({addSort,removeItem,selectedSort,hoveredSort,isHovered,sortOptions,category,audienceShop}) {
     const [filtersSelected, setFiltersSelected] = useState({Brands:[],Shapes:[],"Frame Type":[],"Frame Material":[],"Colors":[],"Sizes":[]});
     const [showFilterOptions, setShowFilterOptions] = useState([]);
    
  const renderFilterOptions = (options, id) => (
    <div id={id} className="font-roboto flex flex-col ml-[-2vw] ">
      <div className=' ml-[2vw] flex border-black border-t-[1px] flex-row items-center'>
    <p className=' mr-auto font-semibold text-mediumText py-[1.25vw]'>{id}</p>
    <svg className=' cursor-pointer' width="1vw" height="1vw" onClick={()=>{
        setShowFilterOptions((prev)=>prev.includes(id)?prev.filter((item)=>item!==id):[...prev,id])
    }} viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.32702 6.47135C6.1464 6.65197 5.85361 6.65197 5.67299 6.47135L0.957725 1.75608C0.777112 1.57546 0.777112 1.28267 0.957725 1.10205L1.17575 0.884C1.35636 0.70338 1.6492 0.70338 1.82982 0.884L6 5.05421L10.1702 0.884C10.3508 0.70338 10.6436 0.70338 10.8242 0.884L11.0423 1.10205C11.2229 1.28267 11.2229 1.57546 11.0423 1.75608L6.32702 6.47135Z" fill="black"/>
    </svg>
    </div>
    <div className={showFilterOptions.includes(id)?'content ':'show content '}> 
    {options.map((option, index) => (
      id=='Colors'?<div key={index} onClick={()=>{setFiltersSelected((prev)=>({
        ...prev,
        [id]:prev[id].includes(option.colorName)?prev[id].filter((item)=>item!==option.colorName):[...prev[id],option.colorName]
    }))}} className={`pl-[2vw] flex flex-row gap-[.75vw] py-[.5vw] items-center cursor-pointer hover:bg-gray-100 ${options.length-1===index?'mb-[1.5vw] ':''}`}>
      <input
        type="radio"
        name={option.colorName} // Ensures all radio buttons in the same group are linked
        value={option.colorName}
        checked={filtersSelected[id].includes(option.colorName)} 
        
        className="w-[1.125vw] h-[1.125vw]"
      />
      <p className="text-regularText">{option.colorName}</p>
    </div>:
      <div key={index} onClick={()=>{setFiltersSelected((prev)=>({
          ...prev,
          [id]:prev[id].includes(option)?prev[id].filter((item)=>item!==option):[...prev[id],option]
      }))}} className={`pl-[2vw] flex flex-row gap-[.75vw] py-[.5vw] items-center cursor-pointer hover:bg-gray-100 ${options.length-1===index?'mb-[1.5vw] ':''}`}>
        <input
          type="radio"
          name={option} // Ensures all radio buttons in the same group are linked
          value={option}
          checked={filtersSelected[id].includes(option)} 
          
          className="w-[1.125vw] h-[1.125vw]"
        />
        <p className="text-regularText">{option}</p>
      </div>
    ))}
    </div>
  </div>
  );
    console.log(filtersSelected)
    return (
        <div>
            <div id='audience' className="font-roboto flex flex-col ml-[-2vw] mb-[1.5vw]">
            {Object.keys(audienceForFilter).map((key) => (
                <TransitionLink to={`/shop/${category}/${key.toLowerCase()}`}>
                <div
                    key={key}
                    id={key.toLowerCase()}
                    className="flex flex-row items-center cursor-pointer hover:bg-gray-100"
                >
                    <p className="pl-[2vw] text-mediumText py-[.5vw]">{audienceForFilter[key]}</p>
                    {audienceShop === audienceForFilter[key] ? (
                    <img src={TickIcon} className="w-[1.4vw] h-[1.4vw] ml-auto" />
                    ) : null}
                </div>
                </TransitionLink>
                ))}
            </div>
            {renderFilterOptions(brands, 'Brands')}
            {renderFilterOptions(shapes, 'Shapes')}
            {renderFilterOptions(frameType, 'Frame Type')}
            {renderFilterOptions(frameMaterial, 'Frame Material')}
            {renderFilterOptions(color, 'Colors')}
            {renderFilterOptions(size, 'Sizes')}    
            <div className='border-black border-t-[1px]'></div>
          </div>
    )
}