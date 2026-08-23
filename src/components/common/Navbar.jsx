import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../core/Homepage/Logo/Logo';
import NavebarLinks from '../../assets/additional data/additional files/data/navbar-links';
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../core/Homepage/Button';
import { useEffect, useState } from 'react';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/api';
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { FiLogIn, FiMenu, FiX } from "react-icons/fi";
import ProfileDropdown from '../core/Navbar/DropDownMenu';

const Navbar = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [subLinks, setSublink] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await apiConnector("GET", categories.CATEGORY_API);
                setSublink(response?.data?.data || []);
            } catch (error) {
                console.log("Could not fetch Categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Close mobile menu on page navigation
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className='sticky top-0 z-50 flex h-20 items-center justify-center border-b border-white/5 bg-[#0B0A10]/80 backdrop-blur-lg transition-all duration-300 w-full'>
            <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
                {/* Logo Section */}
                <Link to='/' className='transition-transform duration-300 hover:scale-105 shrink-0'>
                    <Logo />
                </Link>

                {/* Desktop Nav Links */}
                <nav className='flex max-md:hidden items-center'>
                    <ul className='flex flex-row gap-x-4 lg:gap-x-6'>
                        {NavebarLinks.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <div className='relative text-white flex flex-col group'>
                                        <div className='flex items-center gap-1.5 cursor-pointer py-2 text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-200'>
                                            {link.title}
                                            <FaAngleDown className='group-hover:hidden transition-transform text-[12px] text-gray-400 group-hover:text-white' />
                                            <FaAngleUp className='hidden group-hover:flex transition-transform text-[12px] text-[#7C3AED]' />
                                        </div>

                                        {/* Invisible bridge so hover never breaks */}
                                        <div className='absolute top-[80%] left-0 h-6 w-full hidden group-hover:block'></div>

                                        {/* Dropdown Menu */}
                                        <div className='absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col w-[260px] max-h-[400px] bg-[#0B0A10]/95 backdrop-blur-xl border border-[#231E3D]/60 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(124,58,237,0.15)] p-2 gap-1 z-[99] origin-top animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden'>
                                            
                                            {/* Ambient Glow */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#7C3AED] opacity-20 blur-[40px] rounded-full pointer-events-none" />

                                            <div className='relative z-10 max-h-[380px] overflow-y-auto custom-scrollbar'>
                                                {loading ? (
                                                    <div className='flex justify-center items-center py-6 text-sm text-gray-400'>
                                                        <div className="w-5 h-5 border-2 border-t-[#7C3AED] border-r-[#7C3AED] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                ) : subLinks.length ? (
                                                    subLinks.map((data) => (
                                                        <Link
                                                            key={data._id}
                                                            to={`/catalog/${data.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className='flex items-center text-sm font-medium text-gray-300 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white hover:pl-5 transition-all duration-300 group/link'
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 mr-2 shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
                                                            {data.name}
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <div className='text-sm text-center text-gray-500 py-4'>No categories found</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={link?.path}>
                                        <p className={`text-sm font-medium transition-all duration-300 ${
                                            matchRoute(link?.path) 
                                                ? "px-4 py-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333ea] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] scale-105" 
                                                : "px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-full"
                                        }`}>
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Actions: Cart, Profile dropdown, login/signup (Desktop), Mobile Menu toggle */}
                <div className='flex flex-row items-center gap-x-2 sm:gap-x-3 lg:gap-x-6'>
                    {user && user?.accountType !== 'Instructor' && (
                        <Link 
                            to='/dashboard/cart' 
                            className='relative p-2 text-gray-300 hover:text-white transition-colors duration-300 group'
                        >
                            {/* Hover background for cart icon */}
                            <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-50 group-hover:scale-100" />
                            
                            <MdOutlineShoppingCart size={24} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                            
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#ec4899] to-[#f43f5e] text-[10px] font-bold text-white shadow-lg animate-in zoom-in duration-300">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* Desktop Login/Signup buttons */}
                    {token === null && (
                        <div className="flex max-md:hidden items-center gap-x-2 lg:gap-x-3">
                            <Button active={true} linkto={'/login'} additonal={"rounded-full bg-transparent border border-white/10 hover:border-white/30 hover:bg-white hover:text-black transition-all"}>
                                <div className='flex flex-row items-center gap-2 text-sm font-medium'>
                                    <FiLogIn size={16} />
                                    Login
                                </div>
                            </Button>
                            
                            <Button active={false} linkto={'/signup'} additonal={"rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333ea] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] border-none transition-all duration-300 text-sm font-medium px-4 lg:px-6"}>
                                Sign up
                            </Button>
                        </div>
                    )}
                    
                    {token !== null && (
                        <ProfileDropdown />
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-gray-400 hover:text-white transition-colors duration-200 md:hidden z-50 rounded-lg hover:bg-white/5"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="absolute top-20 left-0 w-full bg-[#0B0A10]/98 backdrop-blur-2xl border-b border-white/5 py-6 px-8 flex flex-col gap-6 md:hidden z-40 animate-in slide-in-from-top duration-300 shadow-2xl">
                    <ul className="flex flex-col gap-4">
                        {NavebarLinks.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Catalog</p>
                                        <div className="flex flex-col gap-3 pl-4 border-l border-white/5">
                                            {loading ? (
                                                <div className="w-4 h-4 border-2 border-t-[#7C3AED] border-r-[#7C3AED] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                            ) : subLinks.length ? (
                                                subLinks.map((data) => (
                                                    <Link
                                                        key={data._id}
                                                        to={`/catalog/${data.name.toLowerCase().replace(/\s+/g, '-')}`}
                                                        className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                                    >
                                                        {data.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-600">No categories</span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={link?.path} className={`text-sm font-medium transition-colors block py-1 ${
                                        matchRoute(link?.path) ? "text-[#7C3AED] font-semibold" : "text-gray-300 hover:text-white"
                                    }`}>
                                        {link.title}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    {token === null && (
                        <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                            <Link to="/login" className="w-full text-center py-2.5 rounded-xl border border-white/10 hover:border-white/30 text-sm font-medium text-white transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9333ea] text-sm font-semibold text-white transition-all">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;