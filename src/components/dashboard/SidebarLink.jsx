import * as Icons from "react-icons/vsc";
import { NavLink, matchPath, useLocation } from "react-router-dom";

const SidebarLinks = ({ link, iconName, onClick }) => {
  // Fallback icon in case the exact name isn't found
  const Icon = Icons[iconName] || Icons.VscQuestion;
  const location = useLocation();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const isActive = matchRoute(link.path);

  return (
    <NavLink
      to={link.path}
      onClick={onClick}
      className={`relative flex items-center gap-x-4 px-6 py-3.5 text-sm font-medium transition-all duration-300 group ${
        isActive
          ? "bg-gradient-to-r from-[#7C3AED]/20 to-transparent text-white"
          : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
      }`}
    >
      {/* Animated Active Indicator */}
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[4px] bg-[#7C3AED] rounded-r-md transition-all duration-300 ease-out shadow-[0_0_10px_rgba(124,58,237,0.5)] ${
          isActive ? "h-full opacity-100" : "h-0 opacity-0 group-hover:h-1/2 group-hover:opacity-30"
        }`}
      />

      {/* Icon Wrapper with Scaling Effect */}
      <div
        className={`transition-all duration-300 ${
          isActive ? "text-[#a855f7]" : "text-gray-500 group-hover:text-gray-300"
        }`}
      >
        <Icon 
          size={20} 
          className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} 
        />
      </div>

      {/* Link Text */}
      <span className="tracking-wide">{link.name}</span>
    </NavLink>
  );
};

export default SidebarLinks;