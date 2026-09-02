import { toast } from "react-hot-toast"
import { apiConnector } from "./apiconnector"
import { courseEndpoints, studentEndpoints } from "./api"
import razorPay from '../assets/images/razor.png'
import { setPaymentLoading } from "../store/courseSlice"
import { resetCart } from "../store/cartSlice"

const key = import.meta.env.VITE_RAZORPAY_KEY;
const {
  COURSE_CATEGORIES_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  UPDATE_SECTION_API,
  DELETE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SUBSECTION_API,
  COURSE_DETAILS_API,
  GET_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  CREATE_RATING_API,
  GET_COURSE_PROGRESS_API,
  UPDATE_COURSE_PROGRESS_API,
  CREATE_CATEGORY_API,
} = courseEndpoints

// fetch categories
export const fetchCourseCategories = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
    console.log("COURSE_CATEGORIES_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("COURSE_CATEGORY_API ERROR............", error)
    toast.error(error.message)
  }
  return result
}

// create category
export const createCategory = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_CATEGORY_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE_CATEGORY_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Create Category")
    }
    toast.success("Category Created Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE_CATEGORY_API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// add course details
export const addCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE_COURSE_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details")
    }
    toast.success("Course Details Added Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE_COURSE_API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// edit course details
export const editCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("EDIT_COURSE_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }
    toast.success("Course Details Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("EDIT_COURSE_API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// create a section
export const createSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE_SECTION_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Create Section")
    }
    toast.success("Course Section Created")
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE_SECTION_API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// update a section
export const updateSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("PATCH", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE_SECTION_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Section")
    }
    toast.success("Course Section Updated")
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE_SECTION_API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// delete a section
export const deleteSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE_SECTION_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }
    toast.success("Course Section Deleted")
    result = response?.data?.data
  } catch (error) {
    console.log("DELETE_SECTION_API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// create a subsection
export const createSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE_SUBSECTION_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture")
    }
    toast.success("Lecture Added Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE_SUBSECTION_API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// update a subsection
export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("PATCH", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE_SUBSECTION_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture")
    }
    toast.success("Lecture Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE_SUBSECTION_API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// delete a subsection
export const deleteSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE_SUBSECTION_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    toast.success("Lecture Deleted")
    result = response?.data?.data
  } catch (error) {
    console.log("DELETE_SUBSECTION_API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// fetch course details
export const fetchCourseDetails = async (courseId, showLoader = false) => {
  let result = null
  const toastId = showLoader ? toast.loading("Loading...") : null
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    })
    console.log("COURSE_DETAILS_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Details")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("COURSE_DETAILS_API ERROR............", error)
    toast.error(error.message)
  }
  if (toastId) toast.dismiss(toastId)
  return result
}

export const createRating = async (data, token) => {
  let result = null
  const toastId = toast.loading("Submitting review...")
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not submit review")
    }
    toast.success(response?.data?.message || "Review submitted successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE_RATING_API ERROR............", error)
    toast.error(error?.response?.data?.message || error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const getCourseProgress = async (courseId, token) => {
  let result = { completedVideos: [] }
  try {
    const response = await apiConnector("POST", GET_COURSE_PROGRESS_API, { courseId }, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch progress")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("GET_COURSE_PROGRESS_API ERROR............", error)
  }
  return result
}

export const updateCourseProgress = async (courseId, subSectionId, token) => {
  let result = null
  try {
    const response = await apiConnector("POST", UPDATE_COURSE_PROGRESS_API, { courseId, subSectionId }, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not update progress")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE_COURSE_PROGRESS_API ERROR............", error)
    toast.error(error?.response?.data?.message || error.message)
  }
  return result
}

export const getPaymentHistory = async (token) => {
  let result = []
  try {
    const response = await apiConnector("GET", studentEndpoints.PAYMENT_HISTORY_API, null, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch payment history")
    }
    result = response?.data?.data || []
  } catch (error) {
    console.log("PAYMENT_HISTORY_API ERROR............", error)
    toast.error(error?.response?.data?.message || error.message)
  }
  return result
}

// fetch instructor courses
export const fetchInstructorCourses = async (token) => {
  let result = []
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_INSTRUCTOR_COURSES_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("GET_INSTRUCTOR_COURSES_API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// delete a course
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE_COURSE_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {
    console.log("DELETE_COURSE_API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
}


// Load the script of razorpay
function loadScript(src){
  return new Promise((resolve)=>{
    const script = document.createElement("script");
    script.src = src;

    script.onload = () =>{
      resolve(true);
    }
    script.onerror= ()=>{
      resolve(false);
    }
    document.body.appendChild(script);
  })
}
// Enroll Course (Direct checkout)
export const enrollCourse = async (courses, token, navigate , userDetails , dispatch) => {
  const toastId = toast.loading("Enrolling in course...")
  try {
    // load the script 
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if(!res){
      toast.error("Razor SDK failed to load");
      return;
    }

    // initiate the order

    const orderResponse = await apiConnector("POST",studentEndpoints.COURSE_PAYMENT_API,{courses},
      {
        Authorization:`Bearer ${token}`
      }
    )

    // console.log(key);
    

    if(!orderResponse.data.success){
       throw new Error(orderResponse.data.message)
    }
    // options

    const options = {
      key,
      currency:orderResponse.data.data.currency,
      amount:`${orderResponse.data.data.amount}`,
      order_id:orderResponse.data.data.id,
      name:"FromSctrach",
      description:"Thank you for purchasing our course",
      image:razorPay,
      prefill:{
          name: `${userDetails.firstName}`,
          email:userDetails.email
      },
      handler: function(response){
        // send successful wala main
        sendPaymentSuccessEmail(response , orderResponse.data.data.amount , token);
        //verify the payment
        verifyPayment({...response , courses},token , navigate ,dispatch);
      }

    }

    const paymentObject = new window.Razorpay(options)

    paymentObject.open()
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.")
      console.log(response.error)
    })
    
  } catch (error) {
    console.log("COURSE_ENROLL_API ERROR............", error)
    toast.error(error?.response?.data?.message || error.message)
  }
  toast.dismiss(toastId)
}
async function sendPaymentSuccessEmail(response , amount , token){
      try {
          const res = await apiConnector("POST",studentEndpoints.COURSE_SUCCESS_MAIL_API,{
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },{
            Authorization:`Bearer ${token}`
          })
          if(!res.data.success){
            throw new Error(res.data.message);
          }
          
      } catch (error) {
        console.log("Error while  the email");
        console.log(error);
      }
}
async function  verifyPayment(bodyData , token , navigate , dispatch) {
      const toastId = toast.loading("Verifying the payment");
      dispatch(setPaymentLoading(true));

      try {
        const response = await apiConnector("POST", studentEndpoints.COURSE_VERIFY_API,bodyData,
                {
        Authorization:`Bearer ${token}`
      }
        )
        if(!response.data.success){
          throw new Error(response.data.message);
        }
        toast.success("Payment Successfull");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
      } catch (error) {
         console.log("Payment verifying",error);
        toast.error("Could not verify the payment");
      }
      toast.dismiss(toastId);
      dispatch(setPaymentLoading(false));
}
