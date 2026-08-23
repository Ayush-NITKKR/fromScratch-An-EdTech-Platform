import { Link, useNavigate } from "react-router-dom"
import { CiMail } from "react-icons/ci";
import { useState } from "react";
import { MdOutlinePassword } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { useDispatch } from "react-redux"
import { login } from "../services/authAPI";


const Login = () =>{
    const navigate = useNavigate();
    const [email , setEmail] = useState("");
    const [showPassword , setShowPassword] = useState(false);
    const [password , setPass] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (e) =>{
        e.preventDefault()
        dispatch(login(email , password , navigate))
    }


    return(
        <div className="flex flex-col items-center justify-center m-10 gap-10">
            <div className=" w-full max-w-md bg-[#0E1118] p-8 rounded-xl shadow-lg flex flex-col gap-4">
                <div className="font-[800] text-5xl text-white">Welcome!</div>
                <div className="text-[#94a3b8]">Don't have account yet?
                    <Link to="/signup" className="hover:text-purple-500 underline"> Sign up</Link>
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
                    <div className="relative flex">
                    {
                        password === "" &&
                        (<MdOutlinePassword className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-2xl"/>)
                    }           
                    <input placeholder="password"
                    type={showPassword? "text" :"password"}
                     className="rounded-[8px] w-full h-10 text-xl text-gray-400 p-2 bg-black pl-10 pr-3"
                     value={password}
                     required
                     name="password"
                     onChange={(e) => setPass(e.target.value)}
                    />
                    {
                        password !== ""
                        &&
                        (
                            !showPassword &&
                            <BiHide className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl" onClick={()=>setShowPassword(true)}/>
                        )
                    }
                    {
                        password !== ""
                        &&
                        (
                            showPassword &&
                            <BiShow className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl" onClick={()=>setShowPassword(false)}/>
                        )
                    }


                    </div>
                    <div className="text-right text-blue-400 hover:text-purple-500">
                        <Link to='/forgot-password'>forget password</Link>
                    </div>
                    <button className="w-full h-10 border bg-blue-500 rounded-xl cursor-pointer hover:bg-purple-500" type="submit">Login</button>                
                </form>
            </div>

        </div>
    )
}
export default Login
