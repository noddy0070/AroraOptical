import TickIcon from '../assets/images/icons/tick_icon.png'
import {Link} from 'react-router-dom';
const audienceForFilter={All:'Everyone',Men:"Men",Women:"Women",Kids:"Kids"}

 export default  function Filters({addSort,removeItem,selectedSort,hoveredSort,isHovered,sortOptions,category,audienceShop}) {

    return (
        <div>
            <div id='audience' className="font-roboto flex flex-col ml-[-2vw] ">
            {Object.keys(audienceForFilter).map((key) => (
                <Link to={`/shop/${category}/${key.toLowerCase()}`}>
                <div
                    key={key}
                    id={key.toLowerCase()}
                    className="flex flex-row items-center cursor-pointer hover:bg-gray-100"
                >
                    <p className="pl-[2vw] text-mediumText py-[.5vw]">{audienceForFilter[key]}</p>
                    {audienceShop === audienceForFilter[key] ? (
                    <img src={TickIcon} className="w-[1.4vw] h-[1.4vw] ml-auto" />
                    ) : null}
                </div>
                </Link>
                ))}
               
                
            </div>
        </div>
    )
}