import React from 'react';
import star from '../../assets/images/star.png';
import blogPlaceholder from '../../assets/images/blogPlaceholder.png';

const testimonials = [
    { rating:5,
        review:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra orn are. Suspendisse varius enim in eros elementum tristique. Suspendisse varius enim in eros elementum tristique.",
        name:"Name Surname",
        place:"Place",
        date:"Date",
        img:blogPlaceholder
    },
    { rating:5,
        review:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra orn are. Suspendisse varius enim in eros elementum tristique. Suspendisse varius enim in eros elementum tristique.",
        name:"Name Surname",
        place:"Place",
        date:"Date",
        img:blogPlaceholder
    },
    { rating:5,
        review:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra orn are. Suspendisse varius enim in eros elementum tristique. Suspendisse varius enim in eros elementum tristique.",
        name:"Name Surname",
        place:"Place",
        date:"Date",
        img:blogPlaceholder
    },
    { rating:5,
        review:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra orn are. Suspendisse varius enim in eros elementum tristique. Suspendisse varius enim in eros elementum tristique.",
        name:"Name Surname",
        place:"Place",
        date:"Date",
        img:blogPlaceholder
    },
] 
export default function CustomerReview() {
    return (
        <div className='py-[7vw] pl-[4vw]'>
            <h2 className='text-h2Text pb-[1.5vw] font-bold'>Customer Reviews</h2>
            <p className='pb-[5vw]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className='flex w-full flex-row gap-[4vw] overflow-x-auto hide-scrollbar justify-normal'>

                {testimonials.map((testimonial,index)=>(
                    <div key={index} className='min-w-[31.45vw]  flex flex-col gap-[2vw]'>
                    <div className='flex flex-row gap-[.25vw]'>
                        <img src={star} className='w-[1.25vw] h-[1.25vw]'></img>
                        <img src={star} className='w-[1.25vw] h-[1.25vw]'></img>
                        <img src={star} className='w-[1.25vw] h-[1.25vw]'></img>
                        <img src={star} className='w-[1.25vw] h-[1.25vw]'></img>
                        <img src={star} className='w-[1.25vw] h-[1.25vw]'></img>
                    </div>
                    <p className='text-mediumText font-bold'>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."</p>
                    <div className='flex flex-row gap-[1.25vw]'>
                        <img src={blogPlaceholder} className='w-[3.5vw] h-[3.5vw]'></img>
                        <div className='flex flex-col'>
                            <span className='text-regularText font-semibold'>Name Surname</span>
                            <span className='text-regularText'>Place | Date</span>
                        </div>

                    </div>
                </div>))

                }
                
            </div>
        </div>
    );
};
