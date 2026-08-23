import { Link } from "react-router-dom";

export function Button ( {children , active , linkto , additonal}){
    return (
        <Link to={linkto}>
            <div className={`transition-all duration-600 hover:scale-105 w-fit
                ${active ? "bg-[#763FE9]" : "bg-[#0A0B10] border border-purple-500"} font-[600] flex flex-row px-10 py-4 gap-2 
                rounded-xl hover:bg-violet-700 text-white ${additonal}`}>
                {children}
            </div>
        </Link>
    )
}
