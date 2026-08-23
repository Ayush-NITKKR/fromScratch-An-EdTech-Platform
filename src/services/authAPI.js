import toast from "react-hot-toast";
import { setLoading } from "../store/authSlice"
import { endpoints } from "../api";
import { apiConnector } from "../apiconnector";


export function getPasswordToken(email , setEmailsent){

    return async(dispatch) =>{
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST" , endpoints.RESETPASSTOKEN_API,{
                email
            })
            console.log(response);

            

            if(!response.data.success){
                throw new Error(response.data.message);
            }
            setEmailsent(true);
            toast.success("Reset email sent")
        } catch (error) {
            console.log("error")
            toast.error("Something went wrong")
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}
export function updatePassword(password , Repassword, token , navigate){
    return async (dispatch)=>{
        const toastId = toast.loading('loading...');
        dispatch(setLoading(true));

        try {
                const response = await apiConnector(
                "POST",
                endpoints.RESETPASSWORD_API,
                {
                    password,
                    confirmPassword: Repassword,
                    token,
                }
                );

            console.log(response);

            if(!response.data.success){
                throw new Error(response);
            }
            toast.success("password changed successfully");
            navigate('/login');
        } catch (error) {
    console.log("Error response:", error.response?.data);
    toast.error(error.response?.data?.message || error.message);
}
        toast.dismiss(toastId)
        dispatch(setLoading(false));
    }
}