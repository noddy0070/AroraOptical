import StoreImg from '../../../assets/images/homePage/store.webp';
import { IconButton,TitleButton } from '../../../components/button';
export default function FreeEyeTest(){
    return (
        <div className='py-[6vw] md:py-[7vw] md:px-[2vw] md:h-[42.75vw] '>
            <div className='flex flex-col md:flex-row h-full gap-[6vw] md:gap-[.625vw]'>
                <div className='order-2 md:order-1 md:ml-[2.25vw] md:w-[28.75vw] md:h-[28.75vw] flex flex-col gap-[6vw] md:gap-[1vw] justify-center'>
                    <h2 className='font-dyeLine text-center leading-[120%] md:text-left text-h4TextPhone md:text-h2Text font-bold '>
                        Free Eye Test <br/>for You
                    </h2>
                    <span className='font-roboto text-center md:text-left text-[14px] md:text-regularText '>
                    Book your free eye test today! Experience the same exceptional service our local customers love—now available nationwide.
                    </span>
                    <div className='mx-auto md:mx-0 flex flex-row w-min md:mt-[1vw] gap-[.1vw] group hover:cursor-pointer scale-100 hover:scale-105 transition-transform duration-700 '>
                        <TitleButton btnHeightPhone={12.5} btnWidthPhone={47}  btnRadiusPhone={9} btnTitle={"Shop"} btnRadius={3.125} btnHeight={4.25} btnWidth={16} className= 'z-[2] group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700' className2='group-hover:text-black'/>
                        <IconButton btnSizePhone={12.5} iconWidthPhone={14} paddingPhone={1} btnSize={4.25} iconWidth={2.1875} padding={0.85} className='group-hover:text-black group-hover:bg-btnHoverColour transition-all duration-700'/>
                    </div>
                </div>

                <div  className='order-1 md:order-2 relative md:w-[28.75vw] md:h-[28.75vw] rounded-[9.5vw] md:rounded-[3.125vw] overflow-hidden'>
                        <a href='https://maps.app.goo.gl/LCz66ym3VdrnA2wH7'>
                        <img className='w-full h-full' src={StoreImg}/>
                        <div className='absolute right-[6vw] top-[6vw] md:right-[1.5vw] md:top-[1.5vw] flex flex-row items-center gap-[1.75vw] md:gap-[.5vw]' >
                            <span className='text-black  text-smallTextPhone md:text-mediumText text-center font-roboto'>
                                View in Maps
                            </span>
                            <IconButton btnSizePhone={9.5} iconWidthPhone={20} paddingPhone={1} btnSize={3.0625} iconWidth={2.1875} padding={0.6} className=''/>
                        </div>
                        <div className='absolute text-white bottom-[6vw] md:bottom-[1.5vw] left-[6vw] md:left-[1.5vw] '>
                            <h3 className='text-h5TextPhone leading-[120%] font-dyeLine font-bold md:text-h3Text'>
                                Arora Optical
                            </h3>
                            <h6 className='text-h6TextPhone leading-[150%] font-dyeLine md:text-h6Text font-bold'>
                                Store Locator
                            </h6>

                        </div>
                        </a>
                </div>
                <div className='order-3 md:order-3 md:w-[28.75vw] flex flex-col    justify-center  md:h-[28.75vw] md:py-[1vw] md:mr-[2.25vw] '>
                    <div className=' '>
                    <h3 className='font-dyeLine font-bold text-h3Text mb-[4vw] md:mb-[1vw]'>
                        Why Choose Us?
                    </h3>
                    <p className="m-0 ">
                        <div className="text-h6TextPhone md:text-h5Text leading-[140%] font-bold font-dyeLine ">
                            {"Expertise You Can Trust: "}<br/>
                            <span className="leading-[150%] font-normal lg:block block md:hidden text-tinyTextPhone md:text-smallText font-roboto">
                                    With 25 years of experience and a reputation for top-notch service, we’ve helped thousands see better.
                            </span>
                            <span className="leading-[150%] font-normal lg:hidden hidden md:block text-tinyTextPhone md:text-smallText font-roboto">
                                With 25 years of excellence, we've improved thousands of lives.
                            </span>
                        </div>
                    </p>
                    <p className="m-0 text-[14px] lg:text-regularText leading-[140%] font-dyeLine">&nbsp;</p>
                    <p className="m-0">
                        <div className="text-h6TextPhone md:text-h5Text leading-[140%] font-bold font-dyeLine">
                            {"Advanced Eye Testing: "}<br/>
                            <span className="leading-[150%] font-normal lg:block block md:hidden text-tinyTextPhone md:text-smallText font-roboto">
                            We offer a comprehensive, no-cost eye test that checks for more than just blurry vision—because good eye health is more than 20/20.
                            </span>
                            <span className="leading-[150%] font-normal lg:hidden hidden md:block text-tinyTextPhone md:text-smallText font-roboto">
                            Get a free eye test that covers more than just vision.
                            </span>
                        </div>
                    </p>
                    <p className="m-0 text-[14px] lg:text-regularText leading-[140%] font-dyeLine " >&nbsp;</p>
                    <p className="m-0">
                    <div className="text-h6TextPhone md:text-h5Text leading-[140%] font-bold font-dyeLine">
                            {"Stylish, Affordable Eyewear: "}<br/>
                            <span className="leading-[150%] font-normal lg:block block md:hidden text-tinyTextPhone md:text-smallText font-roboto">
                            Whether you need prescription glasses, trendy frames, or premium lenses, we've got something for every style and budget.
                            </span>
                            <span className="leading-[150%] font-normal lg:hidden hidden md:block text-tinyTextPhone md:text-smallText font-roboto">
                            From prescription glasses to trendy frames, we have styles for every budget.
                            </span>
                        </div>
                    </p>
                    </div>
                    
                </div>

            </div>
        </div>
    );
};
