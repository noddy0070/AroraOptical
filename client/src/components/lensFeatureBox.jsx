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
        <div onClick={onclick} className=' cursor-pointer relative w-[16.1875vw] h-[19.8215vw] rounded-[1.1175vw] shadow-[0px_.25vw_.25vw_rgba(0,_0,_0,_0.25)] overflow-hidden ' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div className='  relative m-[.25vw] flex flex-col gap-[.25vw] transition-transform transform duration-700 ' style={{ transform: `scale(${hover ? 0.975 : 1})` }}>
                <img src={img} className='w-full h-[9.375vw] rounded-t-[1.0625vw] clickable' />
                <div className={`absolute right-0 mt-[.45vw] mr-[.45vw] top-0 flex flex-row gap-[.375vw] justify-center items-center ${classNameLearnMore}`}>
                    <span className='text-smallText font-roboto'>Learn More</span>
                    <IconButton btnSize={1.8125} iconWidth={1.2} padding={.45}/>
                </div>
                <div className='flex flex-row mx-[.25vw] font-dyeLine font-bold text-h6Text leading-[140%]'>
                    <h6>{title}</h6>
                    <h6 className='ml-auto mr-[.25vw]'>{price==0?"Free":price==-1?"":formatINR(price)}</h6>
                </div>
                <p className='font-roboto text-regularText mt-[.25vw] leading-[150%]'>{description}</p>
            </div>
            <div  className='absolute bg-darkslategrey  flex flex-row justify-center items-center w-full h-[2.1875vw] overflow-hidden cursor-pointer rounded-b-[1.1175vw] transition-all transform duration-500' style={{bottom: hover ?'0' :'-2.1875vw'}}>
                    <p className='text-smallText font-roboto text-white leading-[150%] text-clip'>SELECT</p>
            </div>
        </div>
    )
}


export const  LensTintBox=({form,setForm, handleFocus, img=placeholder, title, description,price,classNameLearnMore='',onclick = () => {},setAmount,amount })=> {
    const [hover, setHover] = useState(false);
    const [selectedColor,setSelectedColor]=useState('Grey');
    const [selectedTitle,setSelectedTitle]=useState(title=='Solid Tint'?'Solid-Tinted-Lens/':'Gradient-Tinted-Lens/');
    return (
        <div onClick={onclick} className=' relative  h-[19.8215vw] rounded-[1.1175vw] shadow-[0px_.25vw_.25vw_rgba(0,_0,_0,_0.25)] transform transition-all duration-700 overflow-hidden flex flex-row' 
        style={{width:hover?"36.625vw":"16.1875vw"}}    onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div className='relative w-[16.1875vw] shadow-[0px_.25vw_.25vw_rgba(0,_0,_0,_0.25)] rounded-[1.1175vw] h-full'>
            <div className='  relative m-[.25vw] flex flex-col gap-[.25vw] transition-transform transform duration-700 ' style={{ transform: `scale(${hover ? 0.95 : 1})` }}>
                <img src={img} className='w-full h-[9.375vw] rounded-t-[1.0625vw] clickable' />
                <div className={`absolute right-0 mt-[.45vw] mr-[.45vw] top-0 flex flex-row gap-[.375vw] justify-center items-center ${classNameLearnMore}`}>
                    <span className='text-smallText font-roboto'>Learn More</span>
                    <IconButton btnSize={1.8125} iconWidth={1.2} padding={.45}/>
                </div>
                <div className='flex flex-row mx-[.25vw] font-dyeLine font-bold text-h6Text leading-[140%]'>
                    <h6>{title}</h6>
                    <h6 className='ml-auto mr-[.25vw]'>{price==0?"Free":formatINR(price)}</h6>
                </div>
                <p className='font-roboto text-regularText mt-[.25vw] leading-[150%]'>{description}</p>
                <p className="relative text-regularText leading-[150%] font-roboto font-bold text-center text-transparent !bg-clip-text
                 [background:linear-gradient(90deg,_#000cdf_7%,_#dd0004)] ">3 Colors Available</p>
            </div>
                <button disabled={selectedColor==null} className='absolute bg-darkslategrey  flex flex-row justify-center items-center w-[16.27vw] h-[2.1875vw] rounded-b-[1.1175vw] overflow-hidden   transition-all transform duration-500' style={{bottom: hover ?'0' :'-2.1875vw'}}>
                        <p className='text-smallText font-roboto text-white leading-[150%] text-clip'>SELECT</p>
                </button>
            </div>
            <div className='flex flex-col  justify-center gap-[1.5vw] transform transition-all duration-700 overflow-hidden' style={{width:hover?"20.4375vw":"0"}} >
                <div className='flex flex-col gap-[1.5vw] ml-[3.125vw] w-min'>
                    <p className="relative text-regularText leading-[150%] font-roboto font-bold text-center text-transparent !bg-clip-text
                    [background:linear-gradient(90deg,_#000cdf_7%,_#dd0004)] line-clamp-1 text-clip overflow-visible whitespace-nowrap ">Select Tint Colour</p>
                    <div className='flex flex-row gap-[1.5vw] overflow-hidden' >
                        <div className='min-w-[4vw]  overflow-hidden'>
                            <img src={greyTintImg} className={`w-auto h-[2.875vw] clickable cursor-pointer hover:opacity-100 ${selectedColor=="Grey"?"opacity-100":"opacity-50"}`}   onClick={()=>setSelectedColor("Grey")}/>   
                            <p className='text-smallText font-roboto text-center py-[.25vw]'>Grey</p>
                        </div>
                        <div className='min-w-[4vw] overflow-hidden'>
                            <img src={brownTintImg} className={`w-auto h-[2.875vw] clickable cursor-pointer hover:opacity-100 ${selectedColor=="Brown"?"opacity-100":"opacity-50"}`} onClick={()=>setSelectedColor("Brown")}/>
                            <p className='text-smallText font-roboto text-center py-[.25vw]'>Brown</p>
                        </div>
                        <div className='min-w-[4vw] overflow-hidden'>
                            <img src={greenTintImg} className={`w-auto h-[2.875vw] clickable cursor-pointer hover:opacity-100 ${selectedColor=="Green"?"opacity-100":"opacity-50"}`} onClick={()=>setSelectedColor("Green")}/>
                            <p className='text-smallText font-roboto text-center py-[.25vw]'>Green</p>
                        </div>
                    </div>
                    <TitleButton btnTitle='Confirm' btnWidth={10} btnHeight={2.5} btnRadius={1.25} className='mx-auto' className2='text-clip'  
                    onClick={()=>{setForm({...form,lensCoating:(selectedTitle + selectedColor)});handleFocus("lensThickness");setAmount(amount+price)}} />
                </div>
            
            </div>
        </div>
    )
}
