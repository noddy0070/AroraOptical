import React,{useState,useEffect} from 'react'
import { baseURL } from '@/url';
import axios from 'axios';
const RefundPolicy = () => {
    const [policy,setPolicy]=useState(null);
     const [date,setDate] = useState(new Date(null));
    
     useEffect(() => {
        axios.get(`${baseURL}/api/admin/get-policy/682e66a5424de8081226383e`)
            .then((res) => {
            setPolicy(res.data.message);
            setDate(new Date(res.data.message.updatedAt));
            })
            .catch((err) => {
            console.error('Failed to fetch policy:', err);
            });
        }, []);
      
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

  return (
    (policy && <div className='w-full'>
      <section className='w-full bg-darkslategrey text-white  px-[5vw] md:px-[6vw] py-[10vw] md:py-[6.25vw]'>
            <h2 className='text-h2TextPhone md:text-h1Text font-bold font-dyeLine'>Cancellation and Refund Policy</h2>
            <p className='text-h6TextPhone md:text-h6Text font-dyeLine'>Last Updated on {formattedDate}</p>
      </section>
      <section className='flex flex-col gap-[10vw] md:gap-[2.5vw] w-full font-roboto text-regularTextPhone md:text-regularText  md:w-[57.25vw] px-[5vw] md:px-[6vw] py-[10vw] md:py-[6.25vw]'>
      <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>Introduction</p>
            <p>{policy.introduction}</p>
        </div>
        {policy.headings.map((value, index) => (
        <div key={index} className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%]'>
            {index+1}. {value}
            </p>
            <ul className={`${policy.descriptions[index].split('/').length==1?"":"list-disc"} list-inside`}>
             {policy.descriptions[index].split('/').map((item, i) => (
        <li key={i} className='pl-[2vw] md:pl-[.5vw]'>
          {item.trim().includes('support@') ? (
            <>
              To request a cancellation, please contact our customer support team at{" "}
              <a className='underline' href={`mailto:${policy.email}`}>{policy.email}</a>
            </>
          ) : item.trim().includes('@') ? (
            <>
              <strong>Email:</strong> <a href={`mailto:${item.split(':')[1]?.trim()}`}>{item.split(':')[1]?.trim()}</a>
            </>
          ) : item.trim().includes('Phone') ? (
            <>
              <strong>Phone:</strong> <a href={`tel:${item.split(':')[1]?.trim()}`}>{item.split(':')[1]?.trim()}</a>
            </>
          ) : (
            item.trim()
          )}
        </li>
      ))}
            </ul>
        </div>
        ))}

         
            <ul className='list-disc list-inside'>
            For further assistance, contact us at:

              <li><strong>Email: </strong><a className='underline' href={`mailto:${policy.email}`}> {policy.email}</a></li>
              <li><strong>Phone: </strong><a className='underline' href={`tel:${policy.number}`}> {policy.number}</a></li>
            </ul>

      </section>
    </div>)
  )
}

export default RefundPolicy
