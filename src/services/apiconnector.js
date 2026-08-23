import axios from "axios";
import { toast } from "react-hot-toast";
import { setUser } from "../store/profileSlice";

export const axiosInstance = axios.create({});
let isRedirecting = false;

export const apiConnector = (method , url , bodyData , headers , params)=>{
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params:params ? params: null,
    });
}