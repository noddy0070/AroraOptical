import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, UserIcon, LayoutIcon, ShoppingIcon, TrendingIcon, SearchIcon } from './Icons';

const DashBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { id: 'Home', path: ['/Admin/Dashboard'], icon: HomeIcon },
    { id: 'Products', path: ['/Admin/Dashboard/products','/Admin/Dashboard/add-product'], icon: LayoutIcon },
    { id: 'Orders', path: ['/Admin/Dashboard/orders'], icon: ShoppingIcon },
    { id: 'User', path: ['/Admin/Dashboard/user'], icon: UserIcon },
    { id: 'Analytics', path: ['/Admin/Dashboard/analytics'], icon: TrendingIcon },
    { id: 'Search', path: ['/Admin/Dashboard/search'], icon: SearchIcon },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-[10vw] min-h-screen bg-darkslategrey flex flex-col items-center gap-[5vw] pt-[2.5vw]">
        <div>
          <h2 className="text-h3Text font-bold font-roboto text-white">AO</h2>
        </div>
        <div className="flex flex-col gap-[1.75vw]">
          {buttons.map(({ id, path, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigate(path[0])}
              className={`w-[7.5vw] h-[3.6vw] gap-[.5vw] flex justify-start pl-[1vw] items-center rounded-[.5vw] transition-all ${
                path.includes(location.pathname ) ? 'bg-white' : 'bg-menu_color'
              }`}
            >
              <Icon strokeColor={path.includes(location.pathname ) ? '#FF8901' : 'white'} />
              <h2
                className="text-regularText font-semibold font-roboto"
                style={{ color: path.includes(location.pathname )  ? '#ffb056' : 'white' }}
              >
                {id}
              </h2>
            </button>
          ))}
        </div>
      </div>

      {/* Right Content Area - Outlet for nested routes */}
      <div className="w-[90vw] bg-[#F8F8F8]">
        <Outlet /> {/* This will render the matched child route */}
      </div>
    </div>
  );
};

export default DashBoard;
