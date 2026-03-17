import React,{useState,useEffect} from 'react'
import { baseURL } from '@/url';
import axios from 'axios';

const TermsAndConditions = () => {
    const [policy,setPolicy]=useState(null);
     const [date,setDate] = useState(new Date(null));
    
     useEffect(() => {
    	// Public policy fetch (read-only)
    	axios.get(`${baseURL}/api/policy/682e6780fb2ffba94269d8cf`)
            .then((res) => {
            setPolicy(res.data.message);
            setDate(new Date(res.data.message.updatedAt));
            })
            .catch((err) => {
            console.error('Failed to fetch policy:', err);
            // Set default policy if not found
            setPolicy({
                headings: ['Acceptance of Terms', 'Use of Website', 'Product Information', 'Orders and Payment', 'Shipping and Delivery', 'Returns and Refunds', 'Intellectual Property', 'Privacy', 'Limitation of Liability', 'Governing Law'],
                descriptions: [
                    'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.',
                    'You may use our website for lawful purposes only. You agree not to use the website in any way that could damage, disable, overburden, or impair any server, or the network(s) connected to any server.',
                    'We strive to provide accurate product descriptions, images, and specifications. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.',
                    'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel your order at any time for certain reasons including but not limited to: product or service availability, errors in the description or price of the product or service, or error in your order.',
                    'Shipping times and costs are provided at the time of checkout. We are not responsible for delays caused by shipping carriers or customs.',
                    'Our return and refund policy is outlined in our separate Refund Policy. Please review it carefully before making a purchase.',
                    'All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of AroraOptical or its content suppliers.',
                    'Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website, to understand our practices.',
                    'In no event shall AroraOptical, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.',
                    'These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions.'
                ],
                email: 'support@aroraopticals.com',
                number: '+91-9876543210',
                introduction: 'These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.',
                updatedAt: new Date().toISOString()
            });
            setDate(new Date());
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
            <h2 className='text-h2TextPhone md:text-h1Text font-bold font-dyeLine'>Terms and Conditions</h2>
            <p className='text-h6TextPhone md:text-h6Text font-dyeLine'>Last Updated on {formattedDate}</p>
      </section>
      <section className='flex flex-col gap-[10vw] md:gap-[2.5vw] w-full font-roboto text-regularTextPhone md:text-regularText  md:w-[57.25vw] px-[5vw] md:px-[6vw] py-[10vw] md:py-[6.25vw]'>
        <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>Introduction</p>
            <p>Welcome to AroraOptical.com. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.</p>
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

        <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p className='font-bold font-dyeLine text-h3TextPhone md:text-h3Text leading-[120%] '>Contact Us</p>
            <div>
            <p>If you have any questions about these Terms and Conditions, please contact us at:</p>
            <ul className='list-disc list-inside'>
                <li className='pl-[2vw] md:pl-[.5vw]'><strong>Email: </strong> <a className='underline' href={`mailto:${policy.email}`}>{policy.email}</a></li>
                <li className='pl-[2vw] md:pl-[.5vw]'><strong>Phone: </strong><a className='underline'  href={`tel:${policy.number}`}> {policy.number}</a></li>
                <li className='pl-[2vw] md:pl-[.5vw]'><strong>Address: </strong> Arora Opticals, Civil Lines, Cantt, Jhansi, Uttar Pradesh 284001</li>
            </ul>
            </div>
        </div>

        <div className='flex flex-col gap-[5vw] md:gap-[1.25vw]'>
            <p>By using our website, you consent to the terms of these Terms and Conditions. Thank you for choosing AroraOptical.com</p>
        </div>

      </section>
    </div>)
  )
}

export default TermsAndConditions
