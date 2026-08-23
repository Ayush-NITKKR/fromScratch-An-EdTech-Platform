import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { Button } from "../components/homepage/Button"
import  CodeBlocks  from "../components/homepage/CodeBlocks"
import Highlightedtxt from '../components/homepage/Highlightedtxt';
import Footer from '../components/common/Footer';

const Home = () =>{
    return (
        <div>
            {/* Section 1 */}
            
            <div className='relative mx-auto flex flex-col w-11/12 items-center  text-white '>
                <Link to={"/signup"}>

                   <div className='group mx-auto transition-all duration-600 hover:scale-105 rounded-full bg-[#763FE9] w-fit'>
                        <div className='flex items-center gap-3 px-10 py-4 rounded-full group-hover:bg-violet-700'>
                            <p className='text-white text-2xl font-medium'>
                                Become an Instructor
                            </p>
                            <FaArrowRight className='text-white text-xl' />
                        </div>
                    </div>
                
                </Link>
                <div className='font-[700] text-3xl sm:text-4xl md:text-5xl lg:text-[62px] leading-tight text-center mt-6'>
                    Join the Best Courses of 
                    <TypeAnimation
                        sequence={[
                        ' DSA',
                        2000,
                        ' Full Stack',
                        2000,
                        ' AI',
                        2000,
                        ' System',
                        2000,
                        ]}
                        speed={30}
                        repeat={Infinity}
                        className="text-purple-500"
                    />
                </div>
                <div className='w-[90%] text-center text-sm sm:text-base md:text-xl lg:text-[24px] font-[500] text-[#94a3b8] gap-10 mt-4 leading-relaxed'>
                    Master in-demand skills with expert-led courses, interactive learning experiences, and personalized guidance designed for your career growth.
                </div>
                {/* Button section */}
                <div className='flex flex-row gap-7 mt-8'>
                        <Button active={true} linkto={"/signup"}>Start Learning</Button>
                        <Button linkto={'#'}>Learn more</Button>
                </div>
                {/* Code section 1 */}
                <div>
                    <CodeBlocks 
                    position = {"flex-row"}
                    heading={
                        <>
                        Unlock your Coding Potential with our online 
                        <Highlightedtxt color={"bg-gradient-to-r from-[#5433FF] via-[#20BDFF] to-[#A5FECB] bg-clip-text text-transparent "} text={" courses"}
                        />
                        </>}
                    subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                    ctabt1={
                        {
                            text:"try it yourself",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabt2={
                        {
                            text:"Learn More",
                            linkto:"#",
                            active:false,
                        }
                    }
                    codeblock={
`<!DOCTYPE html>
<html lang="en">
<head>
<title>Example</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<h1>Hello, World!</h1>
</body>
</html>`}
                    />
        </div>
                <div>
                    <CodeBlocks 
                    position = {"flex-row-reverse"}
                    heading={
                        <>
                        Unlock your Coding Potential with our online 
                        <Highlightedtxt color={"bg-gradient-to-r from-[#5433FF] via-[#20BDFF] to-[#A5FECB] bg-clip-text text-transparent "} text={" courses"}
                        />
                        </>}
                    subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                    ctabt1={
                        {
                            text:"try it yourself",
                            linkto:"/signup",
                            active:true
                        }
                    }
                    ctabt2={
                        {
                            text:"Learn More",
                            linkto:"#",
                            active:false,
                        }
                    }
                    codeblock={
`<!DOCTYPE html>
<html lang="en">
<head>
<title>Example</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<h1>Hello, World!</h1>
</body>
</html>`}
                    />
                </div>
            </div>
            

            {/* section 2 */}


        <div>
            <div className='w-11/12  max-w-maxContent flex items-center gap-5 mx-auto justify-center'>
                        
                        <div className='flex flex-row gap-10 '>
                            <Button active={true} linkto={"/signup"}>
                                <div className='flex items-center gap-3'>
                                        Explore full catalog
                                        <FaArrowRight/>
                                 </div>
                            </Button>
                            <Button active={false} linkto={"/signup"}>
                                <div className='flex items-center gap-3'>
                                        Learn more
                                 </div>
                            </Button>
                        </div>
            
            </div>
        </div>

            {/* section 3 */}
        <div className='w-11/12  max-w-maxContent mx-auto pt-30'>
            <div className='flex flex-row'> 
                <div className='text-white w-[50%] text-[34px]'>
                    Get the skills you need for a  <Highlightedtxt color={"bg-gradient-to-r from-[#5433FF] via-[#20BDFF] to-[#A5FECB] bg-clip-text text-transparent "} text={"job that is in demand."}/>
                </div>
                <div className='text-[#94a3b8] w-[50%] text-[15px] flex flex-col gap-10' >
                    The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                    <Button active={true}>Learn more</Button>
                </div>
            </div>
            <div>

            </div>
        </div>

            {/* footer */}
                        
            <Footer/>

            
        </div>
    )
}

export default Home
