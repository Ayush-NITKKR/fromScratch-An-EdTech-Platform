import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../api";

export async function getUserEnrollCourses(token) {
    const toastId = toast.loading("Loading...");
    let result = [];

    try {
        const response = await apiConnector("GET",
            profileEndpoints.GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorization:`Bearer ${token}`
            }
        )

        console.log(response);
        

        if(!response.data.success){
            throw new Error("Some thing went wrong");
        }
        result = response.data.data;
    } catch (error) {
        console.log("Get user enrolled course api error",error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
}