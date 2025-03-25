import React,{useState,useEffect} from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./home.css";
import * as logos from "../../../assets/images/companyLogos";

const logosData = [
    { src: logos.sf, alt: "SF",height:5.5, heightPhone:10 },
    { src: logos.jimmychoo, alt: "Jimmy Choo",height:2.75, heightPhone:5 },
    { src: logos.burberry, alt: "Burberry",height:4.875, heightPhone:9 },
    { src: logos.bvlgari, alt: "Bvlgari",height:1.625, heightPhone:3 },
    { src: logos.prada, alt: "Prada",height:8.125, heightPhone:12 },
    { src: logos.emporioarmani, alt: "Emporio Armani",height:2, heightPhone:2.50 },
    { src: logos.rayban, alt: "Ray-Ban",height:5.4375, heightPhone:10 },
    { src: logos.ess, alt: "ESS",height:6.25, heightPhone:11.25 },
    { src: logos.miumiu, alt: "Miu Miu",height:2.625, heightPhone:4.75 },
    { src: logos.swarovski, alt: "Swarovski",height:2.125, heightPhone:3.75 },
    { src: logos.dolcegabbana, alt: "Dolce & Gabbana",height:1.625, heightPhone:3 },
    { src: logos.giorgioarmani, alt: "Giorgio Armani",height:2.375, heightPhone:4.25 },
    { src: logos.michaelkors, alt: "Michael Kors",height:4.5, heightPhone:8.25 },
    { src: logos.ralphlauren, alt: "Ralph Lauren",height: 2.25, heightPhone:4 },
    { src: logos.prada2, alt: "Prada 2",height:2.5, heightPhone:6.5 },
    { src: logos.dakley, alt: "Dakley",height: 5.125, heightPhone:9.4},
    { src: logos.tiffany, alt: "Tiffany" ,height:2.5, heightPhone:4.5},
    { src: logos.toryburch, alt: "Tory Burch",height:3.0625, heightPhone:5.5 },
    { src: logos.versace, alt: "Versace",height:5.75, heightPhone:10.5 },
    { src: logos.vogue, alt: "Vogue", height:5.625, heightPhone:10.25 },
  ];

export default function Brands() {
    const slider = React.useRef(null);
    const [screenWidth, setScreenWidth] = useState(null);
      
          useEffect(() => {
            // Set initial width
            setScreenWidth(window.innerWidth);
        
            // Handle window resize
            const handleResize = () => {
              setScreenWidth(window.innerWidth);
            };
        
            // Add event listener
            window.addEventListener("resize", handleResize);
        
            // Cleanup event listener on unmount
            return () => {
              window.removeEventListener("resize", handleResize);
            };
          }, []);
      
          
          const settings = {
            className: "slider variable-width",
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            autoplay: true,
            speed: 1000,
            autoplaySpeed: 1000,
            cssEase: "linear",
            variableWidth: true,
            pauseOnHover: false,       // Prevent autoplay from stopping on hover
            pauseOnFocus: false, 
          };

    return(
        <div className="h-[15vw] md:h-[17.5vw] overflow-hidden mx-[-6vw] md:mx-[-32px] flex justify-center items-center">
        <Slider className="w-full"  ref={slider} {...settings}>
           
        {logosData.map((logo, index) => (
        <div key={index} className="flex relative justify-center items-center">
          <img src={logo.src} alt={logo.alt} className="max-h-full object-contain" style={screenWidth>768?{height:`${logo.height}vw`}:{height:`${logo.heightPhone}vw`}} />
            
        </div>
      ))}

        </Slider>
      </div>

    )
}

