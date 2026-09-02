import toast from "react-hot-toast"
import { setLoading } from "../store/authSlice";
import { apiConnector } from "./apiconnector";
import { endpoints } from "./api";
import { setUser } from "../store/profileSlice";

export function updateProfilePicture(formData , token){
    return async (dispatch) =>{
        const toastId = toast.loading("Uploading profile picture...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector('PATCH',endpoints.UPDATEPROFILEPICTURE_API ,formData,
         {
            Authorization: `Bearer ${token}`,
          }
            )

            if(!response.data.success){
                throw new Error("File could not be uploaded");  
            }
            const updatedUser = response.data?.data;
            if (updatedUser) {
                dispatch(setUser(updatedUser));
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
            toast.success("Profile picture updated successfully");
            
        } catch (error) {
            toast.error(error.message || "Failed to update profile picture");
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    }
}

export function updateProfileData(formData , token , navigate){
    return async (dispatch) =>{
        const toastId = toast.loading("Updating profile...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector('PUT',endpoints.UPDATEPROFILEDATA_API ,formData,
         {
            Authorization: `Bearer ${token}`,
          }
            )

            if(!response.data.success){
                throw new Error(response.data?.message || "Profile could not be updated");  
            }
            const updatedUser = response.data?.data;
            if (updatedUser) {
                dispatch(setUser(updatedUser));
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
            toast.success("Profile updated successfully");
            navigate('/dashboard/my-profile');
        } catch (error) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    }
}