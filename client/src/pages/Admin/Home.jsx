
import DashboardChart from "./AnimatedElemetsGraphs/BarChart";
import DoughnutChart from "./AnimatedElemetsGraphs/DoughnutChart";
import StoreVisitsChart from './AnimatedElemetsGraphs/LineChartHome';

const data =  [
    { name: "Desktop", value: 830.03, percentage: 64.2, color: "#FF8901" },
    { name: "Mobile", value: 755.75, percentage: 48.6, color: "#00C3F8" },
    { name: "Tablet", value: 550.81, percentage: 15.3, color: "#2F80ED" },
    { name: "Unknown", value: 150.84, percentage: 8.6, color: "#FF392B" },
  ].sort((a, b) => b.value - a.value)
  
const Home=()=>{

  return (
    <div className='w-full px-[3vw] py-[3vw] flex flex-col gap-[2vw]'>
        <div>
        <div className="w-[41.1vw] rounded-[1.1vw] shadow-[0px_0.55vw_2.2vw_rgba(51,_38,_174,_0.02)] px-[2vw] py-[2vw] flex flex-col gap-[1vw] bg-white">
            <div className="flex flex-row justify-between items-center ">
                <h6 className="text-h5Text font-roboto font-medium text-[#1C2A53]">Website Traffic</h6>
                <button className="text-regularText font-roboto font-medium text-[#555F7E]">More →</button>
            </div>
            <DashboardChart/>
        </div>
        </div>

        <div className='flex flex-row gap-[2vw]'>
        {/* Cateogries Box In home Page of Admin Panel */}
        <div className="w-[41.1vw] rounded-[1.1vw] shadow-[0px_0.55vw_2.2vw_rgba(51,_38,_174,_0.02)] px-[2vw] py-[2vw] flex flex-col gap-[1vw] bg-white">
      <div className="flex flex-row justify-between items-center ">
        <h6 className="text-h5Text font-roboto font-medium text-[#1C2A53]">Categories</h6>
        <button className="text-regularText font-roboto font-medium text-[#555F7E]">More →</button>
      </div>
      <DoughnutChart data={data}/>
      {/* Legend displaying category details */}
      <div className='flex flex-row justify-between gap-[2.5vw]'>
        <div className='grid grid-cols-3 border-r-[2px] border-[#CDD1DE]'>
            <div className='flex flex-col gap-[1.5vw]'>
                <div className='flex flex-row items-center'>
                    <div className='rounded-full w-[.5vw] h-[.5vw] mr-[.5vw]' style={{backgroundColor:data[0].color}}/>
                    <p className="font-roboto text-smallText text-[#8E95A9] font-medium w-[4.75vw] ">{data[0].name}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <div className='rounded-full w-[.5vw] h-[.5vw] mr-[.5vw]' style={{backgroundColor:data[1].color}}/>
                    <p className="font-roboto text-smallText text-[#8E95A9] font-medium w-[4.75vw] ">{data[1].name}</p>
                </div>          
            </div>
            <div className='flex flex-col gap-[1.5vw]'>
                    <p className="font-roboto text-smallText text-[#1C2A53] font-medium  ">${data[0].value}</p>
                    <p className="font-roboto text-smallText text-[#1C2A53] font-medium  ">${data[1].value}</p>
            </div>
            <div className='flex flex-col gap-[1.5vw]'>
                    <p className="font-roboto text-smallText text-[#8E95A9]">{data[0].percentage} %</p>
                    <p className="font-roboto text-smallText text-[#8E95A9]">{data[1].percentage} %</p>
            </div>
        </div>

        <div className='grid grid-cols-3 '>
            <div className='flex flex-col gap-[1.5vw]'>
                <div className='flex flex-row items-center'>
                    <div className='rounded-full w-[.5vw] h-[.5vw] mr-[.5vw]' style={{backgroundColor:data[2].color}}/>
                    <p className="font-roboto text-smallText text-[#8E95A9] font-medium w-[4.75vw] ">{data[2].name}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <div className='rounded-full w-[.5vw] h-[.5vw] mr-[.5vw]' style={{backgroundColor:data[3].color}}/>
                    <p className="font-roboto text-smallText text-[#8E95A9] font-medium w-[4.75vw] ">{data[3].name}</p>
                </div>          
            </div>
            <div className='flex flex-col gap-[1.5vw]'>
                    <p className="font-roboto text-smallText text-[#1C2A53] font-medium  ">${data[2].value}</p>
                    <p className="font-roboto text-smallText text-[#1C2A53] font-medium  ">${data[3].value}</p>
            </div>
            <div className='flex flex-col gap-[1.5vw]'>
                    <p className="font-roboto text-smallText text-[#8E95A9]">{data[2].percentage} %</p>
                    <p className="font-roboto text-smallText text-[#8E95A9]">{data[3].percentage} %</p>
            </div>
        </div>
      </div>
        </div>

        {/* Cateogries Box In home Page of Admin Panel */}
        <div className="w-[41.1vw] rounded-[1.1vw] shadow-[0px_0.55vw_2.2vw_rgba(51,_38,_174,_0.02)] px-[2vw] py-[2vw] flex flex-col gap-[1vw] bg-white">
            <div className="flex flex-row justify-between items-center ">
                <h6 className="text-h5Text font-roboto font-medium text-[#1C2A53]">Website Traffic</h6>
                <button className="text-regularText font-roboto font-medium text-[#555F7E]">More →</button>
            </div>
            <StoreVisitsChart/>
        </div>

       
        </div>
    </div>
    
    )
}

export default Home;