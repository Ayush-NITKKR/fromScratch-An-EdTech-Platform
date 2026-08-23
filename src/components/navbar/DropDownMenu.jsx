import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiLogOut, FiGrid } from "react-icons/fi";
import { logout } from "../../services/authAPI";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout(navigate));
    setIsOpen(false);
  };

  const handleDashboard = () => {
    navigate("/dashboard/my-profile");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-x-2 group focus:outline-none cursor-pointer rounded-full p-1 pr-2 hover:bg-white/5 transition-colors duration-300"
      >
        <div className="relative flex items-center justify-center">
          {/* Animated Gradient Glow on Hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#a855f7] to-[#ec4899] opacity-60 group-hover:opacity-100 group-hover:blur-md transition-all duration-500" />
          
          <img
            src={user?.image}
            alt={user?.firstName}
            className="relative h-10 w-10 rounded-full border-2 border-transparent bg-[#0B0A10] object-cover z-10 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <FiChevronDown
          className={`text-gray-400 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:text-white ${
            isOpen ? "rotate-180 text-white translate-y-[2px]" : ""
          }`}
          size={18}
        />
      </button>

      {/* Dropdown Menu (Animated via CSS) */}
      <div
        className={`absolute right-0 top-[calc(100%+16px)] w-64 rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1429]/95 to-[#0B0A10]/95 backdrop-blur-xl overflow-hidden z-50 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(124,58,237,0.15)] origin-top-right transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 visible"
            : "opacity-0 scale-95 -translate-y-3 invisible"
        }`}
      >
        {/* User Info Header with Ambient Glow */}
        <div className="relative p-5 border-b border-white/5 bg-white/5 overflow-hidden">
          {/* Background blurred glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED] opacity-20 blur-[50px] rounded-full -z-10" />
          
          <div className="flex items-center gap-4 relative z-10">
            <img
              src={user?.image}
              alt={user?.firstName}
              className="h-12 w-12 rounded-full border-2 border-white/10 shadow-lg object-cover"
            />
            <div className="min-w-0 flex flex-col">
              <p className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs font-bold text-[#a855f7] tracking-wider uppercase mt-0.5">
                {user?.accountType || "Student"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Actions */}
        <div className="p-2 flex flex-col gap-1">
          {/* Dashboard Button */}
          <button
            onClick={handleDashboard}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-300 rounded-xl hover:text-white hover:bg-white/5 transition-all duration-200 text-left group relative overflow-hidden"
          >
            {/* Left Accent Bar on Hover */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#7C3AED] rounded-r-full transition-all duration-300 group-hover:h-3/5" />
            
            {/* Icon Container */}
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#7C3AED]/20 group-hover:text-[#a855f7] transition-colors duration-200">
              <FiGrid size={18} />
            </div>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              Dashboard
            </span>
          </button>

          {/* Divider */}
          <div className="my-1 border-t border-white/5" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-400/80 rounded-xl hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-left group relative overflow-hidden"
          >
            {/* Left Accent Bar on Hover */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-red-500 rounded-r-full transition-all duration-300 group-hover:h-3/5" />

            {/* Icon Container */}
            <div className="p-2 rounded-lg bg-red-500/5 group-hover:bg-red-500/20 transition-colors duration-200">
              <FiLogOut size={18} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            </div>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;