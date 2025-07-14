import React,{useState,useEffect} from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./home.css";
import * as logos from "../../../assets/images/companyLogos";

const logosData = [
    { src: logos.sf, alt: "SF",height:5.5, heightPhone:10 },
    { src: logos.jimmychoo, alt: "Jimmy Choo",height:3.5, heightPhone:5 },
    { src: logos.burberry, alt: "Burberry",height:5, heightPhone:9 },
    { src: logos.prada, alt: "Prada",height:8.125, heightPhone:12 },
    { src: logos.emporioarmani, alt: "Emporio Armani",height:2, heightPhone:2.50 },
    { src: logos.rayban, alt: "Ray-Ban",height:5.4375, heightPhone:10 },
    { src: logos.miumiu, alt: "Miu Miu",height:2.625, heightPhone:4.75 },
    { src: logos.swarovski, alt: "Swarovski",height:3, heightPhone:3.75 },
    { src: logos.dolcegabbana, alt: "Dolce & Gabbana",height:3, heightPhone:3 },
    { src: logos.michaelkors, alt: "Michael Kors",height:3, heightPhone:8.25 },
    { src: logos.prada2, alt: "Prada 2",height:2.5, heightPhone:6.5 },
    { src: logos.oakley, alt: "Oakley",height: 5.125, heightPhone:9.4},
    { src: logos.versace, alt: "Versace",height:5.75, heightPhone:10.5 },
    { src: logos.vogue, alt: "Vogue", height:5.625, heightPhone:10.25 },
    { src: logos.coach, alt:'coach', height:1.875, heightPhone:3.5},
    { src: logos.fossil,alt:'fossil', height:1.875, heightPhone:5.5},
    { src: logos.mauijim, alt:'mauijim',height: 5.75, heightPhone:10.5},
    { src: logos.calvinklein,alt:'calvinklein', height:2.75, heightPhone:5},
    {src: logos.pierrecardin,alt:'pierrecardin', height:5.25, heightPhone:9.5},
    {src: logos.levis,alt:'levis', height:5.625, heightPhone:10.25},
    {src: logos.anahickmann,alt:'anahickmann', height:7, heightPhone:12.75},
    {src: logos.ditalancier,alt:'ditalancier', height:2.5, heightPhone:4},
    {src: logos.montblanc,alt:'montblanc', height:3.25, heightPhone:6},
    {src: logos.hugo,alt:'hugo', height:6.625, heightPhone:12},
    {src: logos.boss,alt:'boss', height:7.875, heightPhone:14.5},
    {src: logos.armaniexchange,alt:'armaniexchange', height:9, heightPhone:16.5}
  ];

export default function Brands() {
    const slider = React.useRef(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
      
          useEffect(() => {
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
            speed: 1500,
            autoplaySpeed: 1500,
            cssEase: "linear",
            variableWidth: true,
            pauseOnHover: false,       // Prevent autoplay from stopping on hover
            pauseOnFocus: false, 
          };

    return(
        <div className="h-[15vw] md:h-[17.5vw]  overflow-hidden mx-[-6vw] md:mx-[-32px] flex justify-center items-center">
        <Slider className="w-full"  ref={slider} {...settings}>
           
        {logosData.map((logo, index) => (
        <div key={index} className="flex relative justify-center items-center ">
          <img src={logo.src} alt={logo.alt} className="max-h-full object-contain " style={screenWidth>768?{height:`${logo.height}vw`} : {height: `${logo.heightPhone}vw`}} />
            
        </div>
      ))}

        </Slider>
      </div>

    )
}

