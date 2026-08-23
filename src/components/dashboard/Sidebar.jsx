import { useDispatch, useSelector } from 'react-redux';
import { sidebarLinks } from '../../../assets/additional data/additional files/data/dashboard-links';
import { logout } from '../../services/authAPI';
import SidebarLinks from './SidebarLink';
import { FiLogOut, FiLoader } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, loading: profileLoading } = useSelector((state) => state.profile);
    const { loading, token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Show a sleek loading state instead of a render-blocking toast
    if (profileLoading || loading) {
        return (
            <div className="flex max-md:hidden h-[calc(100vh-3.5rem)] w-64 flex-col border-r border-[#231E3D]/50 bg-[#0B0A10]/95 items-center justify-center">
                <FiLoader className="text-[#7C3AED] animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className={`fixed md:relative top-20 md:top-0 left-0 z-40 flex h-[calc(100vh-5rem)] md:h-[calc(100vh-3.5rem)] w-64 min-w-[256px] flex-col border-r border-[#231E3D]/50 bg-[#0B0A10]/95 backdrop-blur-xl py-6 transition-all duration-300 ${
            isOpen ? "translate-x-0" : "max-md:-translate-x-full"
        }`}>
            
            {/* Top Links Section */}
            <div className="flex flex-col gap-1">
                {sidebarLinks.map((link) => {
                    // Conditionally render based on account type
                    if (link.type && user?.accountType !== link.type) return null;

                    return (
                        <SidebarLinks key={link.id} link={link} iconName={link.icon} onClick={onClose} />
                    );
                })}
            </div>

            {/* Bottom Links Section */}
            <div className="mt-auto flex flex-col gap-1 pt-6 border-t border-[#231E3D]/50 w-full">
                
                <SidebarLinks 
                    link={{ name: "Settings", path: "settings" }} 
                    iconName="VscSettingsGear" 
                    onClick={onClose}
                />

                {token !== null && (
                    <button
                        onClick={() => dispatch(logout(navigate))}
                        className="relative flex w-full items-center gap-x-4 px-6 py-3.5 text-sm font-medium text-red-400/80 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 group"
                    >
                        {/* Animated Active Indicator for consistency */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] bg-red-500 rounded-r-md transition-all duration-300 ease-out h-0 opacity-0 group-hover:h-1/2 group-hover:opacity-100 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                        
                        <div className="text-red-500/80 group-hover:text-red-400 transition-colors duration-300">
                            <FiLogOut 
                                size={20} 
                                className="transition-transform duration-300 group-hover:-translate-x-1" 
                            />
                        </div>
                        
                        <span className="tracking-wide">Sign Out</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;