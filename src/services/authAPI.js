import toast from "react-hot-toast";
import { setLoading, setToken, setSignupData } from "../store/authSlice"
import { setUser } from "../store/profileSlice"
import { endpoints, loginAPI, SENDOTP_API, SIGNUP_API } from "./api";
import { apiConnector } from "./apiconnector";


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

export function login(email, password, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Logging in...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", loginAPI.LOGIN_API, { email, password });
            console.log("LOGIN API RESPONSE:", response);
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Login Successful");
            dispatch(setToken(response.data.token));
            const userImage = response.data?.existingUser?.image
                ? response.data.existingUser.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.existingUser.firstName} ${response.data.existingUser.lastName}`;
            dispatch(setUser({ ...response.data.existingUser, image: userImage }));
            localStorage.setItem("token", JSON.stringify(response.data.token));
            localStorage.setItem("user", JSON.stringify(response.data.existingUser));
            navigate("/dashboard/my-profile");
        } catch (error) {
            console.log("LOGIN API ERROR:", error);
            toast.error(error?.response?.data?.message || error.message || "Login Failed");
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    };
}

export function sendOtp(email) {
    return async (dispatch) => {
        const toastId = toast.loading("Sending OTP...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", SENDOTP_API, { email, checkUserPresent: true });
            console.log("SEND OTP RESPONSE:", response);
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("OTP Sent Successfully");
        } catch (error) {
            console.log("SEND OTP ERROR:", error);
            toast.error(error?.response?.data?.message || error.message || "Could Not Send OTP");
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    };
}

export function signUp(formData, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Creating Account...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", SIGNUP_API, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.Repassword,
                accountType: formData.accountType,
                otp: formData.otp,
                contactNumber: formData.phoneNo,
            });
            console.log("SIGNUP API RESPONSE:", response);
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Account Created Successfully");
            navigate("/login");
        } catch (error) {
            console.log("SIGNUP API ERROR:", error);
            toast.error(error?.response?.data?.message || error.message || "Signup Failed");
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    };
}

export function logout(navigate) {
    return (dispatch) => {
        dispatch(setToken(null));
        dispatch(setUser(null));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged Out");
        navigate("/");
    };
}