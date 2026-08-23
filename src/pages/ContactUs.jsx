import { Link, useNavigate } from "react-router-dom"
import { CiMail } from "react-icons/ci";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineSubject } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineMessage } from "react-icons/md";
import Footer from "../components/common/Footer";



const ContactUs = () =>{
            const navigate = useNavigate();

            const [formData, setFormData] = useState({
              firstName: "",
              lastName: "",
              email: "",
              phoneNo: "",
              subject: "",
              message: "",
            });

            const changeHandler = (e) => {
             setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
            };

            function handleSubmit(e){
                e.preventDefault();

                // Mock API call
                toast.success("Message sent successfully!");
                
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  phoneNo: "",
                  subject: "",
                  message: "",
                });
            }


    return(
        <div className="flex flex-col items-center justify-center m-10 gap-10">
  <div className="w-full max-w-lg bg-[#0E1118] p-8 rounded-xl shadow-lg flex flex-col gap-5">

    <div className="font-[800] text-5xl text-white">
      Get In Touch!
    </div>

    <div className="text-[#94a3b8]">
         Have questions about our courses? Want to discuss your learning journey? We're here to help you succeed.
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
          className="w-1/2 rounded-lg bg-black h-10 px-3 text-gray-300 focus:border
                  outline-none
          focus:border-purple-500"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={changeHandler}
          className="w-1/2 rounded-lg bg-black h-10 px-3 text-gray-300 focus:border
                  outline-none
          focus:border-purple-500"
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
          className="w-full rounded-lg bg-black h-10 text-gray-300 pl-10 pr-3 focus:border
                  outline-none
          focus:border-purple-500"
        />

      </div>

      {/* Phone */}
    <div className="relative flex flex-row gap-1.5">
        <IoCallOutline className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xl"/>

      <input
        type="text"
        name="phoneNo"
        placeholder="Phone Number"
        value={formData.phoneNo}
        onChange={changeHandler}
        className="w-full rounded-lg bg-black h-10 text-gray-300 pl-10 pr-3 focus:border
                  outline-none
          focus:border-purple-500"
      />
    </div>

      {/* Password */}

      <div className="relative">

        <MdOutlineSubject className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xl"/>

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={changeHandler}
          className="w-full rounded-lg bg-black h-10 text-gray-300 pl-10 pr-3 focus:border
                    outline-none
          focus:border-purple-500"
        />

      </div>

      <div className="relative w-full">

        <MdOutlineMessage className="absolute left-2 top-9 -translate-y-1/2 text-gray-400 text-xl"/>

        <textarea
          name="message"
          placeholder="Tell us more about your inquiry"
          value={formData.message}
          onChange={changeHandler}
          className="          w-full
          h-50
          resize-none
          rounded-2xl
          focus:border
          border-richblack-700
          bg-black
          text-white
          placeholder:text-richblack-400
          pl-10
          pt-5
          pr-6
          pb-6
          outline-none
          focus:border-purple-300
"
        />

      </div>


      <button
        type="submit"
        className="w-full h-10 rounded-lg transition-colors duration-800 ease-in-out bg-blue-600 hover:bg-purple-500 hover:text-black text-white font-semibold"
      >
        Send message
      </button>

    </form>

  </div>
  <Footer></Footer>
</div>
    )
}
export default ContactUs
