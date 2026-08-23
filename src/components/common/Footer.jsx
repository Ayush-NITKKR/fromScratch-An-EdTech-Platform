import { Link } from 'react-router-dom';
const Footer = () =>{
    return(
        <div>
            <div className="h-[4px] bg-gradient-to-r from-purple-500 via-orange-500 to-purple-500 w-11/12  max-w-maxContent mx-auto mt-50"></div>

            <div className='flex flex-row text-white justify-evenly pt-15'>
                <div className='w-[25%] flex flex-col gap-4' >
                    <div className='text-[#7c49ebfd] text-[24px] font-[700] font-poppins'>from-scratch</div>
                    <div className='w-[90%] text-[15px] font-[500] text-[#94a3b8] gap-5 leading-8'>A community of coders, making the world a better place through technology and education.</div>
                </div>
                <div className='flex flex-col gap-3'>
                    <div className='text-white text-[20px] font-[700] font-poppins'>Quick link</div> 
                    <div className='w-[90%] text-[15px] font-[500] text-[#94a3b8] leading-8'>Home</div>
                    <div className='w-[90%] text-[15px] font-[500] text-[#94a3b8]  leading-8'>About us</div>
                    <div className='w-[90%] text-[15px] font-[500] text-[#94a3b8]  leading-8'>Tutorials</div>
                    <div className='w-[90%] text-[15px] font-[500] text-[#94a3b8]  leading-8'>Contact Us</div>
                </div>
                <div className='flex flex-col gap-4'>
                    <div className='text-white text-[20px] font-[700] font-poppins '>Company</div> 
                    <div className='w-[90%] text-[15px] font-[500] text-[#94a3b8] leading-8'>Terms & Conditions</div>
                    <div className='w-[90%] text-[15px] font-[500] text-[#94a3b8]  leading-8'>Privacy Policy</div>
                </div>
                <div className='w-[25%] flex flex-col gap-4 px-2' >
                    <div className='text-[#efe7fffd] text-[24px] font-[700] font-poppins'>Stay Connected</div>
                    <div className='w-[90%] text-[15px] font-[500] text-[#94a3b8] gap-5 leading-8'>Don't let your dreams stay dreams. Build your skills with us and turn them into reality.</div>
                    <div className='flex flex-row gap-10'>
                        <Link to={"https://www.youtube.com/@LWA2003"}><div><img src="https://coderarmy.in/assets/images/youtube-logo.svg" alt="" className='pt-3' height={40} width={35}/></div></Link>
                        <Link to={"https://www.linkedin.com/in/ayush-tiwari-513146290/"}><div><img src="https://static.vecteezy.com/system/resources/thumbnails/023/986/926/small/linkedin-logo-linkedin-logo-transparent-linkedin-icon-transparent-free-free-png.png" alt="" height={50} width={40}/></div></Link>
                        <Link to={'https://www.instagram.com/__ayuussh_/'}><div><img src="https://static.vecteezy.com/system/resources/thumbnails/038/447/961/small/ai-generated-instagram-logo-free-png.png" alt="" height={40} width={40}/></div></Link>
                    </div>
                </div>
            </div>
            <div className="h-[4px] w-11/12  max-w-maxContent mx-auto bg-gray-800 m-5"></div>
            <div className='w-[90%] text-[15px] font-[500] text-[#94a3b8] gap-5 leading-8'>Copyright © 2026 by from-scratch | All Rights Reserved.</div>
        </div>
    )
}
export default Footer;