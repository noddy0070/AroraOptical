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
        <div className='py-[6vw] md:py-[7vw] pl-[5vw] md:pl-[4vw]'>
            <h2 className='text-h3TextPhone md:text-h2Text pb-[3vw] md:pb-[1.5vw] font-bold'>Customer Reviews</h2>
            <p className='pb-[6vw] md:pb-[5vw] text-regularTextPhone md:text-regularText'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className='flex w-full flex-row gap-[4vw] md:gap-[4vw] overflow-x-auto hide-scrollbar justify-normal'>

                {testimonials.map((testimonial,index)=>(
                    <div key={index} className='min-w-[80vw] md:min-w-[31.45vw] flex flex-col gap-[4vw] md:gap-[2vw]'>
                    <div className='flex flex-row gap-[1vw] md:gap-[.25vw]'>
                        <img src={star} className='w-[5vw] md:w-[1.25vw] h-[5vw] md:h-[1.25vw]'></img>
                        <img src={star} className='w-[5vw] md:w-[1.25vw] h-[5vw] md:h-[1.25vw]'></img>
                        <img src={star} className='w-[5vw] md:w-[1.25vw] h-[5vw] md:h-[1.25vw]'></img>
                        <img src={star} className='w-[5vw] md:w-[1.25vw] h-[5vw] md:h-[1.25vw]'></img>
                        <img src={star} className='w-[5vw] md:w-[1.25vw] h-[5vw] md:h-[1.25vw]'></img>
                    </div>
                    <p className='text-mediumTextPhone md:text-mediumText font-bold'>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."</p>
                    <div className='flex flex-row gap-[3vw] md:gap-[1.25vw]'>
                        <img src={blogPlaceholder} className='w-[14vw] md:w-[3.5vw] h-[14vw] md:h-[3.5vw] rounded-full object-cover'></img>
                        <div className='flex flex-col'>
                            <span className='text-regularTextPhone md:text-regularText font-semibold'>Name Surname</span>
                            <span className='text-regularTextPhone md:text-regularText'>Place | Date</span>
                        </div>

                    </div>
                </div>))

                }
                
            </div>
        </div>
    );
};
