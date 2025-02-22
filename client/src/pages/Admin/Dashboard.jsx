import React, { useState } from 'react'

//Importing Pages
import Home from './Home'
import Layout from './Layout';
import Shopping from './Shopping';
import User from './User';
import Trending from './Trending';
import Search from './Search';
import Book from './Book'
import Gift from './Gift';


//Importing Icons
import {HomeIcon,UserIcon,LayoutIcon,ShoppingIcon, TrendingIcon, SearchIcon, BookIcon, GiftIcon} from './Icons'
const DashBoard = () => {
    const [activeButton,setActiveButton]=useState('home');
    
    const pages = {
        'home': <Home/>,
        'layout': <Layout/>,
        'shopping': <Shopping/>,
        'user': <User/>,
        'trending': <Trending/>,
        'search':<Search/>,
        'book':<Book/>,
        'gift':<Gift/>
    }

    const buttons = [
        { id: "home", icon: HomeIcon },
        { id: "layout", icon: LayoutIcon },
        { id: "shopping", icon: ShoppingIcon },
        { id: "user", icon: UserIcon },
        { id: "trending", icon: TrendingIcon },
        { id: "search", icon: SearchIcon },
        { id: "book", icon: BookIcon },
        { id: "gift", icon: GiftIcon }

      ];

    return (
        <div className="flex">
            <div className="w-[10vw] min-h-screen bg-darkslategrey flex flex-col items-center gap-[5vw] pt-[2.5vw]">
                <div>
                    <h2 className='text-h3Text font-bold font-roboto text-white'>AO</h2>
                </div>
                <div className='flex flex-col gap-[1.75vw]'>
                    {buttons.map(({ id, icon: Icon }) => (
                        <button
                        key={id}
                        onClick={() => setActiveButton(id)}
                        className={`w-[3.6vw] h-[3.6vw]  flex justify-center items-center rounded-[.5vw] transition-all ${
                            activeButton === id ? "bg-white" : "bg-menu_color"
                        }`}
                        >
                        <Icon strokeColor={activeButton === id ? "#FF8901" : "white"} />
                        </button>
                    ))}
                </div>

            </div>
           <div className='w-[90vw] bg-[#F8F8F8]'>
                {pages[activeButton] || <p className="text-red-500 text-center">Page not found</p>}
            </div>
        </div>
    )
}


export default DashBoard