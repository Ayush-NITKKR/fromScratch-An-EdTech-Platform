import { Link, useLocation, useNavigate } from "react-router-dom"
import { CiMail } from "react-icons/ci";
import { useState } from "react";
import { MdOutlinePassword } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { useDispatch } from "react-redux"
import { sendOtp, signUp } from "../services/authAPI";
import toast from "react-hot-toast";
import { updatePassword } from "../services/authAPI";


const UpdatePassword = () =>{
            const [showPassword, setShowPassword] = useState(false);
            const [showConfirmPassword, setShowConfirmPassword] = useState(false);
            const dispatch = useDispatch();
            const navigate = useNavigate();
            const location = useLocation();

            const [formData, setFormData] = useState({
            password: "",
            Repassword: ""
            });

            const changeHandler = (e) => {
            const { name, value } = e.target;

            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
            };

            function handleSubmit(e){
                e.preventDefault();

                const token = location.pathname.split('/').at(-1);

              if (formData.password !== formData.Repassword) {
                  toast.error("Passwords Do Not Match")
                  return
                }

                dispatch(updatePassword(formData.password , formData.Repassword , token , navigate))

                    // setFormData({
                    //   firstName: "",
                    //   lastName: "",
                    //   email: "",
                    //   phoneNo: "",
                    //   password: "",
                    //   Repassword: "",
                    //   accountType: "Student",
                    //   otp: "",
                    //   })
            }


    return(
        <div className="flex flex-col items-center justify-center m-10 gap-10">
  <div className="w-full max-w-lg bg-[#0E1118] p-8 rounded-xl shadow-lg flex flex-col gap-5">

    <div className="font-[800] text-5xl text-white">
      Choose  new password
    </div>

    <div className="text-[#94a3b8]">
      Almost done. Enter your new password and youre all set.
    </div>

    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >




      {/* Password */}

      <div className="relative">

        <MdOutlinePassword className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xl"/>

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="New Password"
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
          placeholder="Confirm New Password"
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



      <button
        type="submit"
        className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      >
Reset Password
      </button>

    </form>

  </div>
</div>
    )
}
export default UpdatePassword
