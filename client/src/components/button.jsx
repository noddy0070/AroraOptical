import React from 'react';
import ArrowNorthEast from "../assets/images/ArrowNorthEast.png";
export const IconButton = ({ onClick = () => {}, className = '', iconWidth, btnSize }) => {
    return (
        <button
            onClick={onClick}
            style={{
                width: `${btnSize}vw`,
                height: `${btnSize}vw`,
                padding: '0.85vw',
            }}
            className={`bg-darkslategrey text-white flex justify-center items-center rounded-full ${className}`}
        >
            <img
                style={{ width: `${iconWidth}vw` }}
                src={ArrowNorthEast}
                alt="arrow"
            />
        </button>
    );
};

  
  export const TitleButton = ({ onClick={}, className = '',btnTitle,btnWidth, btnHeight,btnRadius }) => {
    return (
        <button  onClick={onClick}
        className={` bg-darkslategrey text-white  ${className}` }  style={{
            width: `${btnWidth}vw`,
            height: `${btnHeight}vw`,
            borderRadius: `${btnRadius}vw`
        }}       >
        <span className="text-[1rem] text-center font-roboto "> {btnTitle}</span>
      </button>
    );
  };