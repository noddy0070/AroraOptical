import React from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./home.css";
import * as logos from "../../../assets/images/companyLogos";

const logosData = [
    { src: logos.sf, alt: "SF",height:5.5 },
    { src: logos.jimmychoo, alt: "Jimmy Choo",height:2.75 },
    { src: logos.burberry, alt: "Burberry",height:4.875 },
    { src: logos.bvlgari, alt: "Bvlgari",height:1.625 },
    { src: logos.prada, alt: "Prada",height:8.125 },
    { src: logos.emporioarmani, alt: "Emporio Armani",height:2 },
    { src: logos.rayban, alt: "Ray-Ban",height:5.4375 },
    { src: logos.ess, alt: "ESS",height:6.25 },
    { src: logos.miumiu, alt: "Miu Miu",height:2.625 },
    { src: logos.swarovski, alt: "Swarovski",height:2.125 },
    { src: logos.dolcegabbana, alt: "Dolce & Gabbana",height:1.625 },
    { src: logos.giorgioarmani, alt: "Giorgio Armani",height:2.375 },
    { src: logos.michaelkors, alt: "Michael Kors",height:4.5 },
    { src: logos.ralphlauren, alt: "Ralph Lauren",height: 2.25 },
    { src: logos.prada2, alt: "Prada 2",height:2.5 },
    { src: logos.dakley, alt: "Dakley",height: 5.125},
    { src: logos.tiffany, alt: "Tiffany" ,height:2.5},
    { src: logos.toryburch, alt: "Tory Burch",height:3.0625 },
    { src: logos.versace, alt: "Versace",height:5.75 },
    { src: logos.vogue, alt: "Vogue", height:5.625},
  ];

export default function Brands() {
    const slider = React.useRef(null);
          
          const settings = {
            className: "slider variable-width",
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            autoplay: true,
            speed: 2000,
            autoplaySpeed: 2000,
            cssEase: "linear",
            variableWidth: true,
          };

    return(
        <div className="h-[17.5vw] bg-green-200 overflow-hidden mx-[-32px] flex justify-center items-center">
        <Slider className="w-full"  ref={slider} {...settings}>
           
        {logosData.map((logo, index) => (
        <div key={index} className="flex justify-center items-center">
          <img src={logo.src} alt={logo.alt} className="max-h-full object-contain" style={{height:`${logo.height}vw`}} />
        </div>
      ))}

        </Slider>
      </div>

    )
}

 {/* 
                 */}
