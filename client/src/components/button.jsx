import React from 'react';
import ArrowNorthEast from "../assets/images/ArrowNorthEast.png";
export const IconButton = ({ onClick = () => {}, className = '', iconWidth, btnSize,padding }) => {
    return (
        <button
            onClick={onClick}
            style={{
                width: `${btnSize}vw`,
                height: `${btnSize}vw`,
                padding: `${padding}vw`,
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
        <span className="text-regularText text-center font-roboto p-[.1vw]"> {btnTitle}</span>
      </button>
    );
  };