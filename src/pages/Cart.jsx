import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromCart, resetCart } from "../store/cartSlice";
import { apiConnector } from "../services/apiconnector";
import { studentEndpoints } from "../services/api";
import RatingStars from "../components/common/RatingStars";
import GetAvgRating from "../utils/avgRating";
import { FaTrash, FaGraduationCap } from "react-icons/fa6";
import { toast } from "react-hot-toast";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, total, totalItems } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);

  const [checkingOut, setCheckingOut] = useState(false);

  const handleRemoveItem = (courseId) => {
    dispatch(removeFromCart(courseId));
  };

  const handleCheckout = async () => {
    if (!token) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }
    
    setCheckingOut(true);
    if (!token) {
      toast.error("Please login to purchase courses");
      navigate("/login");
      return;
    }
    if (user?.accountType === "Instructor" || user?.accountType === "Admin") {
      toast.error("Instructors and Admins cannot purchase courses");
      return;
    }
    // Call enrollCourse operation directly
    await enrollCourse([courseId], token, navigate , dispatch);
  };

  return (
    <div className="flex flex-col gap-6 text-white min-h-[calc(100vh-10rem)] w-full">
      {/* Title */}
      <div className="flex flex-col gap-1 border-b border-white/5 pb-4 w-full">
        <h1 className="text-3xl font-bold tracking-tight text-white">Cart</h1>
        <p className="text-sm text-gray-400">
          {totalItems} {totalItems === 1 ? "course" : "courses"} currently in your cart.
        </p>
      </div>

      {totalItems > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start w-full">
          {/* Cart Items List */}
          <div className="flex flex-col gap-5 md:col-span-2 w-full">
            {cart.map((course) => {
              const avgRating = GetAvgRating(course?.ratingAndReview) || 0;
              return (
                <div
                  key={course._id}
                  className="flex flex-col gap-6 md:flex-row md:items-center justify-between rounded-2xl border border-white/5 bg-[#141221]/30 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-[#141221]/50 w-full"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center flex-grow w-full">
                    {/* Thumbnail */}
                    <div 
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="w-full md:w-44 aspect-video rounded-xl overflow-hidden border border-white/5 shrink-0 cursor-pointer group"
                    >
                      <img
                        src={course?.thumbnail}
                        alt={course?.courseName}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Meta details */}
                    <div className="flex flex-col gap-1.5 flex-grow">
                      <h2 
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="text-lg font-bold leading-snug hover:text-[#A78BFA] transition-colors cursor-pointer line-clamp-2"
                      >
                        {course?.courseName}
                      </h2>
                      <p className="text-sm text-gray-400">
                        Category: {course?.category?.name}
                      </p>
                      
                      {/* Rating details */}
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="font-semibold text-amber-400">{avgRating}</span>
                        <RatingStars Review_Count={avgRating} Star_Size={14} />
                        <span className="text-xs text-gray-500 font-medium">
                          ({course?.ratingAndReview?.length || 0} Ratings)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-none border-white/5 pt-4 md:pt-0 mt-2 md:mt-0 gap-4 shrink-0">
                    <button
                      onClick={() => handleRemoveItem(course._id)}
                      className="flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/20 px-3.5 py-2.5 rounded-xl transition-all duration-200"
                    >
                      <FaTrash size={12} />
                      <span>Remove</span>
                    </button>
                    <span className="text-xl font-extrabold text-white">
                      ₹{course?.price?.toLocaleString("en-IN") || 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Card */}
          <div className="md:col-span-1 w-full">
            <div className="flex flex-col gap-5 rounded-2xl border border-white/5 bg-[#141221]/50 p-6 backdrop-blur-md w-full">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Total Price
              </h2>
              
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-extrabold text-white">
                  ₹{total?.toLocaleString("en-IN") || 0}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ₹{(total * 1.5)?.toLocaleString("en-IN") || 0}
                </span>
              </div>

              <button
                disabled={checkingOut}
                onClick={handleCheckout}
                className="w-full rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] py-3.5 text-sm font-semibold text-white shadow-lg transition-transform duration-200 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:pointer-events-none"
              >
                {checkingOut ? "Processing..." : "Buy Now"}
              </button>

              <div className="flex flex-col gap-2 border-t border-white/5 pt-4 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Price ({totalItems} items)</span>
                  <span>₹{total?.toLocaleString("en-IN") || 0}</span>
                </div>
                <div className="flex justify-between text-green-400 font-medium">
                  <span>Discount</span>
                  <span>-₹{(total * 0.5)?.toLocaleString("en-IN") || 0}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2 font-semibold text-white">
                  <span>Subtotal</span>
                  <span>₹{total?.toLocaleString("en-IN") || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center border border-white/5 bg-[#141221]/10 rounded-3xl p-12 text-center gap-4 mt-6 w-full">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7C3AED]/10 text-[#7C3AED]">
            <FaGraduationCap size={32} />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h2 className="text-xl font-bold">Your Cart is Empty</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Looks like you haven't added any courses to your cart yet. Explore our catalog to find your next learning adventure!
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-2 rounded-xl bg-[#7C3AED] px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#6D28D9]"
          >
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;