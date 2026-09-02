const BASE_URL = import.meta.env.VITE_BASE_URL;
export const categories = {
    CATEGORY_API: BASE_URL + '/course/showAllCategories',
};
export const loginAPI = {
    LOGIN_API: BASE_URL + '/auth/login',
};
export const SENDOTP_API = BASE_URL + '/auth/sendOtp'
export const SIGNUP_API = BASE_URL + '/auth/signup'


// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
}
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  RESETPASSTOKEN_API: BASE_URL + "/Profile/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/Profile/reset-password",
  UPDATEPROFILEPICTURE_API: BASE_URL + "/Profile/updateProfilePicture",
  UPDATEPROFILEDATA_API: BASE_URL + "/Profile/updateProfile"
}
// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/course/getEnrolledCourses",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/showAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetail",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_CATEGORY_API: BASE_URL + "/course/createCategory",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addsubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updatesubSection",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deletesubSection",
  GET_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
  GET_COURSE_PROGRESS_API: BASE_URL + "/course/getCourseProgress",
  UPDATE_COURSE_PROGRESS_API: BASE_URL + "/course/updateCourseProgress",
}

// STUDENT ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  COURSE_ENROLL_API: BASE_URL + "/payment/enrollCourse",
  COURSE_SUCCESS_MAIL_API: BASE_URL + "/payment/sendPaymentSuccessMail",
  PAYMENT_HISTORY_API: BASE_URL + "/payment/history",
}

// Contact Us

export const contactUsEndpoint = {
    CONTACT_US_API: BASE_URL + "/public/contact"
}
  