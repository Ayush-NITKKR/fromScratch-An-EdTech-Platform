import toast from "react-hot-toast"
import { setLoading } from "../store/authSlice";
import { apiConnector } from "./apiconnector";
import { endpoints } from "./api";
import { setUser } from "../store/profileSlice";

export function updateProfilePicture(formData , token){
    return async (dispatch) =>{
        const toastId = toast.loading("uploading profile picture..");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector('PATCH',endpoints.UPDATEPROFILEPICTURE_API ,formData,
         {
            Authorization: `Bearer ${token}`,
          }
            )

            console.log(response);

            if(!response.data.success){
                throw new Error("File is not uplodeding");  
            }
            const updatedUser = response.data?.data;
            console.log(updatedUser);
            dispatch(setUser(updatedUser));
            toast.success("uploaded successfully");
            
        } catch (error) {
            toast.error(error.message);
            toast.dismiss(toastId);
            
        }
        toast.dismiss(toastId);
    }

}
export function updateProfileData(formData , token , navigate){
    return async (dispatch) =>{
        const toastId = toast.loading("uploading profile picture..");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector('PUT',endpoints.UPDATEPROFILEDATA_API ,formData,
         {
            Authorization: `Bearer ${token}`,
          }
            )

            console.log(response);

            if(!response.data.success){
                throw new Error("File is not uplodeding");  
            }
            const updatedUser = response.data?.profile;
            dispatch(setUser(updatedUser));
            toast.success("updated successfully");
            navigate('/dashboard/my-profile')
        } catch (error) {
            toast.error(error.message);
            toast.dismiss(toastId);
            
        }
        toast.dismiss(toastId);
    }

}