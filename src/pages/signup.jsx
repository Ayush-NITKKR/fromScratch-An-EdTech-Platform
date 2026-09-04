import { Link, useNavigate } from "react-router-dom"
import { CiMail } from "react-icons/ci";
import { useState } from "react";
import { MdOutlinePassword } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { useDispatch } from "react-redux"
import { sendOtp, signUp } from "../services/authAPI";
import toast from "react-hot-toast";
import { IoCallOutline } from "react-icons/io5";



const Signup = () =>{
            const [showPassword, setShowPassword] = useState(false);
            const [showConfirmPassword, setShowConfirmPassword] = useState(false);
            const dispatch = useDispatch();
            const navigate = useNavigate();

            const [formData, setFormData] = useState({
            firstName: "",
            lastName: "",
            email: "",
            phoneNo: "",
            password: "",
            Repassword: "",
            accountType: "Student",
            otp: "",
            });

            const changeHandler = (e) => {
             setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
            };

            function handleSubmit(e){
                e.preventDefault();

              if (formData.password !== formData.Repassword) {
                  toast.error("Passwords Do Not Match")
                  return
                }

                dispatch(signUp(formData , navigate))

                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phoneNo: "",
                      password: "",
                      Repassword: "",
                      accountType: "Student",
                      otp: "",
                      })
            }


    return(
        <div className="flex flex-col items-center justify-center m-10 gap-10">
  <div className="w-full max-w-lg bg-[#0E1118] p-8 rounded-xl shadow-lg flex flex-col gap-5">

    <div className="font-[800] text-5xl text-white">
      Create Account
    </div>

    <div className="text-[#94a3b8]">
      Already have an account?
      <Link
        to="/login"
        className="hover:text-purple-500 underline"
      >
        {" "}Login
      </Link>
    </div>

    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >

      {/* First & Last Name */}

      <div className="flex gap-3">

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={changeHandler}
          className="w-1/2 rounded-lg bg-black h-10 px-3 text-gray-300"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={changeHandler}
          className="w-1/2 rounded-lg bg-black h-10 px-3 text-gray-300"
        />

      </div>

      {/* Email */}

      <div className="relative">

        <CiMail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xl"/>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={changeHandler}
          className="w-full rounded-lg bg-black h-10 text-gray-300 pl-10 pr-3 "
        />

      </div>

      {/* Phone */}
      <div className="relative flex items-center">

        <IoCallOutline className="absolute left-2" color="grey"/>

        <input
          type="text"
          name="phoneNo"
          placeholder="Phone Number"
          value={formData.phoneNo}
          onChange={changeHandler}
          className="rounded-lg bg-black h-10 px-3 text-gray-300 pl-10 pr-3 w-full"
        />
      </div>

      {/* Account Type */}

      <select
        name="accountType"
        value={formData.accountType}
        onChange={changeHandler}
        className="rounded-lg bg-black h-10 px-3 text-gray-300 w-full"
      >
        <option value="Student">Student</option>
        <option value="Instructor">Instructor</option>
      </select>

      {/* Password */}

      <div className="relative">

        <MdOutlinePassword className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xl"/>

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={changeHandler}
          className="w-full rounded-lg bg-black h-10 text-gray-300 pl-10 pr-3"
        />

        {
          showPassword ?
          <BiShow
            onClick={()=>setShowPassword(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-2xl"
          />
          :
          <BiHide
            onClick={()=>setShowPassword(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-2xl"
          />
        }

      </div>

      {/* Confirm Password */}

      <div className="relative">

        <MdOutlinePassword className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xl"/>

        <input
          type={showConfirmPassword ? "text" : "password"}
          name="Repassword"
          placeholder="Confirm Password"
          value={formData.Repassword}
          onChange={changeHandler}
          className="w-full rounded-lg bg-black h-10 text-gray-300 pl-10 pr-3"
        />

        {
          showConfirmPassword ?
          <BiShow
            onClick={()=>setShowConfirmPassword(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-2xl"
          />
          :
          <BiHide
            onClick={()=>setShowConfirmPassword(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-2xl"
          />
        }

      </div>

      {/* OTP */}

      <div className="flex gap-3 flex-col md:flex-row">

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={formData.otp}
          onChange={changeHandler}
          className="flex-1 rounded-lg bg-black h-10 px-3 text-gray-300"
        />

        <button
          type="button"
          className=" bg-yellow-400 text-black px-4 rounded-lg hover:bg-yellow-300 transition"
          onClick={() => dispatch(sendOtp(formData.email))}
        >
          Send OTP
        </button>

      </div>

      <button
        type="submit"
        className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      >
        Create Account
      </button>

    </form>

  </div>
</div>
    )
}
export default Signup
