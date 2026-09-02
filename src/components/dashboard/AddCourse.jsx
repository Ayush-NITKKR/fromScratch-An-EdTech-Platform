import { useEffect, useState } from "react";
import FormLabel from "../common/FormLabel";
import RequiredAsterisk from "../common/RequiredAsterisk";
import DropDown from "../common/DropDown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/api";
import RenderSteps from "./RenderSteps";
export default function AddCourse(){

    const [Category, setCategory] = useState(["Choose a category"]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
                title: "",
                description: "",
                price: "",
                category: "",
                password: "",
                Repassword: "",
                accountType: "Student",
                otp: "",
                });
    function changeHandler(e){
            setFormData((prev)=>({
                ...prev,
                [e.target.name]:e.target.value,
            }));
    };
    function submitHandler(e){
            e.preventDefault();

    }
    useEffect(() => {
            const fetchCategories = async () => {
                setLoading(true);
                try {
                    const response = await apiConnector("GET", categories.CATEGORY_API);
                    setCategory(response?.data?.data || []);
                } catch (error) {
                    console.log("Could not fetch Categories:", error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchCategories();
        }, []);
    return(
    <div className="text-white">
        <div>
            <RenderSteps/>
            <div>

            </div>

        </div>
    </div>
    )
}