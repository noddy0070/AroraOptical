import React,{useState} from 'react'
import placeholder from '../assets/images/CategoryPlaceholder.png';
import greenTintImg from '../assets/images/lensPage/greenTint.png';
import greyTintImg from '../assets/images/lensPage/greyTint.png';
import brownTintImg from '../assets/images/lensPage/brownTint.png';
import { IconButton, TitleButton } from './button';
import { formatINR } from './IntToPrice';

export const LensFeatureBox=({ img=placeholder, title, description,price,classNameLearnMore='',onclick = () => {} })=> {
    const [hover, setHover] = useState(false);
    return (
        <div onClick={onclick} className='cursor-pointer relative w-[64.75vw] md:w-[16.1875vw] h-[79.286vw] md:h-[19.8215vw] rounded-[4.47vw] md:rounded-[1.1175vw] shadow-[0px_1vw_1vw_rgba(0,_0,_0,_0.25)] md:shadow-[0px_.25vw_.25vw_rgba(0,_0,_0,_0.25)] overflow-hidden' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div className='relative m-[1vw] md:m-[.25vw] flex flex-col gap-[1vw] md:gap-[.25vw] transition-transform transform duration-700' style={{ transform: `scale(${hover ? 0.975 : 1})` }}>
                <img src={img} className='w-full h-[37.5vw] md:h-[9.375vw] rounded-t-[4.25vw] md:rounded-t-[1.0625vw] clickable' />
                <div className={`absolute right-0 mt-[1.8vw] md:mt-[.45vw] mr-[1.8vw] md:mr-[.45vw] top-0 flex flex-row gap-[1.5vw] md:gap-[.375vw] justify-center items-center ${classNameLearnMore}`}>
                    <span className='text-smallTextPhone md:text-smallText font-roboto'>Learn More</span>
                    <IconButton btnSizePhone={7.25} iconWidthPhone={4.8} paddingPhone={1.8} btnSize={1.8125} iconWidth={1.2} padding={.45}/>
                </div>
                <div className='flex flex-row mx-[1vw] md:mx-[.25vw] font-dyeLine font-bold text-h6TextPhone md:text-h6Text leading-[140%]'>
                    <h6>{title}</h6>
                    <h6 className='ml-auto mr-[1vw] md:mr-[.25vw]'>{price==0?"Free":price==-1?"":formatINR(price)}</h6>
                </div>
                <p className='font-roboto text-regularTextPhone md:text-regularText mt-[1vw] md:mt-[.25vw] leading-[150%]'>{description}</p>
            </div>
            <div className='absolute bg-darkslategrey flex flex-row justify-center items-center w-full h-[8.75vw] md:h-[2.1875vw] overflow-hidden cursor-pointer rounded-b-[4.47vw] md:rounded-b-[1.1175vw] transition-all transform duration-500' style={{bottom: hover ?'0' :'-8.75vw'}}>
                    <p className='text-smallTextPhone md:text-smallText font-roboto text-white leading-[150%] text-clip'>SELECT</p>
            </div>
        </div>
    )
}


export const  LensTintBox=({form,setForm, handleFocus, img=placeholder, title, description,price,classNameLearnMore='',onclick = () => {},setAmount,amount })=> {
    const [hover, setHover] = useState(false);
    const [selectedColor,setSelectedColor]=useState('Grey');
    const [selectedTitle,setSelectedTitle]=useState(title=='Solid Tint'?'Solid-Tinted-Lens/':'Gradient-Tinted-Lens/');
    return (
        <div onClick={onclick} className='relative h-[79.286vw] md:h-[19.8215vw] rounded-[4.47vw] md:rounded-[1.1175vw] shadow-[0px_1vw_1vw_rgba(0,_0,_0,_0.25)] md:shadow-[0px_.25vw_.25vw_rgba(0,_0,_0,_0.25)] transform transition-all duration-700 overflow-hidden flex flex-col md:flex-row' 
        style={{width: hover ? (window.innerWidth > 768 ? "36.625vw" : "100%") : (window.innerWidth > 768 ? "16.1875vw" : "64.75vw")}} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div className='relative w-full md:w-[16.1875vw] shadow-[0px_1vw_1vw_rgba(0,_0,_0,_0.25)] md:shadow-[0px_.25vw_.25vw_rgba(0,_0,_0,_0.25)] rounded-[4.47vw] md:rounded-[1.1175vw] h-full'>
            <div className='relative m-[1vw] md:m-[.25vw] flex flex-col gap-[1vw] md:gap-[.25vw] transition-transform transform duration-700' style={{ transform: `scale(${hover ? 0.95 : 1})` }}>
                <img src={img} className='w-full h-[37.5vw] md:h-[9.375vw] rounded-t-[4.25vw] md:rounded-t-[1.0625vw] clickable' />
                <div className={`absolute right-0 mt-[1.8vw] md:mt-[.45vw] mr-[1.8vw] md:mr-[.45vw] top-0 flex flex-row gap-[1.5vw] md:gap-[.375vw] justify-center items-center ${classNameLearnMore}`}>
                    <span className='text-smallTextPhone md:text-smallText font-roboto'>Learn More</span>
                    <IconButton btnSizePhone={7.25} iconWidthPhone={4.8} paddingPhone={1.8} btnSize={1.8125} iconWidth={1.2} padding={.45}/>
                </div>
                <div className='flex flex-row mx-[1vw] md:mx-[.25vw] font-dyeLine font-bold text-h6TextPhone md:text-h6Text leading-[140%]'>
                    <h6>{title}</h6>
                    <h6 className='ml-auto mr-[1vw] md:mr-[.25vw]'>{price==0?"Free":formatINR(price)}</h6>
                </div>
                <p className='font-roboto text-regularTextPhone md:text-regularText mt-[1vw] md:mt-[.25vw] leading-[150%]'>{description}</p>
                <p className="relative text-regularTextPhone md:text-regularText leading-[150%] font-roboto font-bold text-center text-transparent !bg-clip-text [background:linear-gradient(90deg,_#000cdf_7%,_#dd0004)]">3 Colors Available</p>
            </div>
                <button disabled={selectedColor==null} className='absolute bg-darkslategrey flex flex-row justify-center items-center w-full md:w-[16.27vw] h-[8.75vw] md:h-[2.1875vw] rounded-b-[4.47vw] md:rounded-b-[1.1175vw] overflow-hidden transition-all transform duration-500' style={{bottom: hover ?'0' :'-8.75vw'}}>
                        <p className='text-smallTextPhone md:text-smallText font-roboto text-white leading-[150%] text-clip'>SELECT</p>
                </button>
            </div>
            <div className='flex flex-col justify-center gap-[6vw] md:gap-[1.5vw] transform transition-all duration-700 overflow-hidden' style={{width: hover ? (window.innerWidth > 768 ? "20.4375vw" : "100%") : "0", display: hover ? 'flex' : (window.innerWidth > 768 ? 'flex' : 'none')}}>
                <div className='flex flex-col gap-[6vw] md:gap-[1.5vw] ml-[12.5vw] md:ml-[3.125vw] w-min'>
                    <p className="relative text-regularTextPhone md:text-regularText leading-[150%] font-roboto font-bold text-center text-transparent !bg-clip-text [background:linear-gradient(90deg,_#000cdf_7%,_#dd0004)] line-clamp-1 text-clip overflow-visible whitespace-nowrap">Select Tint Colour</p>
                    <div className='flex flex-row gap-[6vw] md:gap-[1.5vw] overflow-hidden'>
                        <div className='min-w-[16vw] md:min-w-[4vw] overflow-hidden'>
                            <img src={greyTintImg} className={`w-auto h-[11.5vw] md:h-[2.875vw] clickable cursor-pointer hover:opacity-100 ${selectedColor=="Grey"?"opacity-100":"opacity-50"}`} onClick={()=>setSelectedColor("Grey")}/>   
                            <p className='text-smallTextPhone md:text-smallText font-roboto text-center py-[1vw] md:py-[.25vw]'>Grey</p>
                        </div>
                        <div className='min-w-[16vw] md:min-w-[4vw] overflow-hidden'>
                            <img src={brownTintImg} className={`w-auto h-[11.5vw] md:h-[2.875vw] clickable cursor-pointer hover:opacity-100 ${selectedColor=="Brown"?"opacity-100":"opacity-50"}`} onClick={()=>setSelectedColor("Brown")}/>
                            <p className='text-smallTextPhone md:text-smallText font-roboto text-center py-[1vw] md:py-[.25vw]'>Brown</p>
                        </div>
                        <div className='min-w-[16vw] md:min-w-[4vw] overflow-hidden'>
                            <img src={greenTintImg} className={`w-auto h-[11.5vw] md:h-[2.875vw] clickable cursor-pointer hover:opacity-100 ${selectedColor=="Green"?"opacity-100":"opacity-50"}`} onClick={()=>setSelectedColor("Green")}/>
                            <p className='text-smallTextPhone md:text-smallText font-roboto text-center py-[1vw] md:py-[.25vw]'>Green</p>
                        </div>
                    </div>
                    <TitleButton btnTitle='Confirm' btnWidthPhone={40} btnHeightPhone={10} btnRadiusPhone={5} btnWidth={10} btnHeight={2.5} btnRadius={1.25} className='mx-auto' className2='text-clip'  
                    onClick={()=>{setForm({...form,lensCoating:(selectedTitle + selectedColor)});handleFocus("lensThickness");setAmount(amount+price)}} />
                </div>
            
            </div>
        </div>
    )
}
