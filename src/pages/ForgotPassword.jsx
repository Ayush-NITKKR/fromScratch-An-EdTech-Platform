import { Link, useNavigate } from "react-router-dom"
import { CiMail } from "react-icons/ci";
import { useState } from "react";
import { MdOutlinePassword } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux"
import { GoArrowLeft } from "react-icons/go";
import { login } from "../services/authAPI";
import { getPasswordToken } from "../services/authAPI";

const ForgotPassword = ()=>{
    const navigate = useNavigate();
    const [email , setEmail] = useState("");
    const [password , setPass] = useState("");
    const [emailSent , setEmailSent] = useState(false);
    const dispatch = useDispatch();

    const {loading} = useSelector((state)=>state.auth);

    const handleSubmit = (e) =>{
        e.preventDefault()
        dispatch(getPasswordToken(email, setEmailSent));
    }
    return(
<div>
    {
        loading ? (
            <div>
                
            </div>
        ): (
            <div>
        {  !emailSent  && <div className="flex flex-col items-center justify-center m-10 gap-10">
            <div className=" w-full max-w-md bg-[#0E1118] p-8 rounded-xl shadow-lg flex flex-col gap-4">
                <div className="font-[800] text-5xl text-white">Reset your password</div>
                <div className="text-[#94a3b8]">Have no fear. We’ll email you instructions to reset your password. If you dont
                     have access to your email we can try account recovery
                </div>
                <form className="flex flex-col gap-4"  onSubmit={handleSubmit}>
                    <div className="relative flex">
                    {
                        email === "" &&
                        (<CiMail className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-2xl"/>)
                    }           
                    <input placeholder="email address"
                     className="rounded-[8px] w-full h-10 text-xl p-2 text-gray-400 bg-black pl-10 pr-3"
                     value={email}
                     name="email"
                     required
                     onChange={(e) => setEmail(e.target.value)}
                    />
                    </div> 
                    <button className="w-full h-10 border bg-blue-500 rounded-xl cursor-pointer hover:bg-purple-500" type="submit">Reset password</button>                
                </form>
            </div>

        </div>
        }
       { emailSent && <div className="flex flex-col items-center justify-center m-10 gap-10">
            <div className=" w-full max-w-md bg-[#0E1118] p-8 rounded-xl shadow-lg flex flex-col gap-4">
                <div className="font-[800] text-5xl text-white">Check email</div>
                <div className="text-[#94a3b8]">We have sent the reset email to 
                {email}
                </div>
                <form className="flex flex-col gap-4"  onSubmit={handleSubmit}>
                    <button className="w-full h-10 border bg-blue-500 rounded-xl cursor-pointer hover:bg-purple-500" type="submit">
                        Resend Email</button>                
                </form>
                <div className="text-white w-fit">
                    
                    <Link to="/login" className="flex flex-row items-center gap-2 hover:text-purple-500">
                        <GoArrowLeft />  Back to login
                    </Link>
                </div>
            </div>

        </div>
        }

        </div>
        )
    }

</div>
    
        

    )
}
export default ForgotPassword;