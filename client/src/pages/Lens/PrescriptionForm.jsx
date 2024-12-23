

export default function PrescriptionForm(){
    return (
        <div id='prescriptionFormMain' className='' >
            <h1 className='font-bold font-dyeLine text-h1Text text-center'>Enter Prescription</h1>
            <div className='mx-auto py-[1.5vw] px-[1vw]  w-[69.75vw] flex flex-col gap-[1.25vw] font-roboto text-regularText'>
                <p className=" text-center">We strongly recommend you to <a className="underline">Upload a Photo</a> of your prescription. It's simple and eliminated any chances of Errors.</p>
                <form className="px-[1.125vw] flex flex-col gap-[0vw] ">
                    <input className="py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]" placeholder="Enter Prescription Name"></input>
                    <div className="flex flex-row w-full gap-[1.875vw]">
                        <div className="grid grid-rows-3 mr-auto items-center ">
                            <div></div>
                            <span className="font-medium">Right Eye OD</span>
                            <span className="font-medium">Left Eye OS</span>
                        </div>
                        <div className=" grid grid-rows-3 w-[15.625vw] items-center">
                            <span className="font-medium mt-auto mb-[.125vw]">Sphere(SPH)</span>
                            <input className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]" placeholder="+/-"></input>
                            <input className="my-[.25vw] py-[.625vw] px-[1vw] w-full border-[1px] border-black rounded-[.5vw]" placeholder="+/-"></input>
                        </div>
                        <div className="grid grid-rows-3 w-[9.625vw] items-center">
                            <span className="font-medium mt-auto mb-[.125vw]">Cylinder(CYL)</span>
                            <div></div>
                            <div></div>
                        </div>
                        <div className="grid grid-rows-3 w-[9.625vw] items-center">
                            <span className="font-medium mt-auto mb-[.125vw]">Axis</span>
                            <div></div>
                            <div></div>
                        </div>
                        <div className="grid grid-rows-3 w-[15.625vw] items-center">
                            <span className="font-medium mt-auto mb-[.125vw]">Near(ADD)</span>
                            <div></div>
                            <div>hi</div>
                        </div>
                        </div>

                </form>
            </div>
            <div className=' ml-auto mt-[4vw] mr-[2vw] items-center flex flex-row w-[68.75vw]'>
                </div>
        </div>
    )
}