import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseDetails } from "../services/courseDetailsAPI";
import { enrollCourse } from "../services/courseDetailsAPI";
import { addToCart, removeFromCart } from "../store/cartSlice";
import RatingStars from "../components/common/RatingStars";
import GetAvgRating from "../utils/avgRating";
import Footer from "../components/common/Footer";
import { 
  FaGlobe, 
  FaRegCalendar, 
  FaCirclePlay, 
  FaChevronDown, 
  FaChevronUp, 
  FaShareFromSquare, 
  FaLock 
} from "react-icons/fa6";
import { FiClock, FiFileText } from "react-icons/fi";
import { toast } from "react-hot-toast";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { cart } = useSelector((state) => state.cart);

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      try {
        const result = await fetchCourseDetails(courseId);
        if (result) {
          setCourseData(result);
          // calculate average rating
          const count = GetAvgRating(result?.ratingAndReview);
          setAvgReviewCount(count);
        }
      } catch (error) {
        console.error("Could not fetch course details:", error);
      } finally {
        setLoading(false);
      }
    };
    getDetails();
  }, [courseId]);

  // Expand/collapse course content sections
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };
  const handleGotoCourse = () =>{
    if(user?.accountType === "Instructor"){
        navigate("/dashboard/my-courses");
    }
    if(user?.accountType ==="Student"){
      navigate("/dashboard/enrolled-courses");
    }else{
        toast.caller("Admin is not allowed");
    }
    
  }
  const handleAddToCart = () => {
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    if (user?.accountType === "Instructor" || user?.accountType === "Admin") {
      toast.error("Instructors and Admins cannot purchase courses");
      return;
    }
    
    dispatch(addToCart(courseData));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(courseData._id));
  };

  const handleBuyNow = async () => {
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
     await enrollCourse(
    [courseId],
    token,
    navigate,
    user,
    dispatch
);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // Helper values
  const isEnrolled = 
    courseData?.studentEnrolled?.includes(user?._id) || 
    user?.courses?.includes(courseId);
    
  const isInCart = cart?.some((item) => item._id === courseId);

  // Total lectures and duration calculation
  const totalLectures = courseData?.courseContent?.reduce(
    (acc, section) => acc + (section.subSection?.length || 0),
    0
  ) || 0;

  if (loading) {
    return <CourseDetailsSkeleton />;
  }

  if (!courseData) {
    return (
      <div className="grid min-h-[calc(100vh-10rem)] place-items-center bg-[#0A0B10] text-white">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-bold">Course Not Found</h1>
          <p className="text-gray-400">We couldn't retrieve the details for this course right now.</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold transition-colors duration-200 hover:bg-[#6D28D9]"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white">
      {/* Hero Banner Section */}
      <section className="relative border-b border-white/5 bg-gradient-to-b from-[#141221] to-[#0A0B10] py-12 lg:py-20">
        <div className="pointer-events-none absolute -top-40 right-0 h-[400px] w-[400px] rounded-full bg-[#7C3AED] opacity-10 blur-[150px]" />
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-6 lg:flex-row lg:justify-between">
          {/* Main Info */}
          <div className="flex flex-col justify-center gap-4 lg:w-7/12">
            <nav className="flex items-center text-xs font-medium text-gray-400" aria-label="Breadcrumb">
              <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate("/")}>Home</span>
              <span className="mx-2">/</span>
              <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate(`/catalog/${courseData?.category?.name?.toLowerCase().replace(/\s+/g, '-')}`)}>
                {courseData?.category?.name}
              </span>
              <span className="mx-2">/</span>
              <span className="font-semibold text-[#7C3AED]" aria-current="page">{courseData?.courseName}</span>
            </nav>

            <h1 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
              {courseData?.courseName}
            </h1>
            <p className="text-base leading-relaxed text-gray-300">
              {courseData?.courseDescription}
            </p>

            {/* Ratings & Enrolled Count */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
              <span className="font-semibold text-amber-400">{avgReviewCount}</span>
              <RatingStars Review_Count={avgReviewCount} Star_Size={16} />
              <span className="text-gray-400">
                ({courseData?.ratingAndReview?.length || 0} Reviews)
              </span>
              <span className="text-gray-500">•</span>
              <span className="font-medium text-gray-300">
                {courseData?.studentEnrolled?.length || 0} Students Enrolled
              </span>
            </div>

            {/* Additional Details */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-300 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">Created by:</span>
                <span className="text-[#A78BFA] font-semibold">
                  {courseData?.instructor?.firstName} {courseData?.instructor?.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaRegCalendar className="text-gray-400" />
                <span>Created {new Date(courseData?.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaGlobe className="text-gray-400" />
                <span>English</span>
              </div>
            </div>
          </div>

          {/* Spacer for floating card on desktop */}
          <div className="hidden lg:block lg:w-4/12" />
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="mx-auto w-11/12 max-w-maxContent py-12 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row">
          
          {/* Left Column: Details & Accordion */}
          <div className="flex flex-col gap-10 lg:w-8/12">
            
            {/* What you'll learn */}
            <div className="rounded-2xl border border-white/5 bg-[#141221]/30 p-6 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4 text-[#A78BFA]">What you'll learn</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm text-gray-300">
                {courseData?.whatYouWillLearn?.split("\n").map((line, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-[#7C3AED] mt-0.5 font-bold">✓</span>
                    <span>{line}</span>
                  </div>
                )) || <p>Details not specified.</p>}
              </div>
            </div>

            {/* Course Content Accordion */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Course Content</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {courseData?.courseContent?.length || 0} Sections • {totalLectures} Lectures
                  </p>
                </div>
                <button
                  onClick={() => {
                    const allExpanded = Object.keys(expandedSections).length === courseData?.courseContent?.length;
                    const next = {};
                    if (!allExpanded) {
                      courseData?.courseContent?.forEach((sec) => {
                        next[sec._id] = true;
                      });
                    }
                    setExpandedSections(next);
                  }}
                  className="text-xs font-semibold text-[#A78BFA] transition-colors hover:text-white"
                >
                  {Object.keys(expandedSections).length === courseData?.courseContent?.length ? "Collapse all" : "Expand all"}
                </button>
              </div>

              {/* Accordion List */}
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#141221]/20">
                {courseData?.courseContent?.map((section) => {
                  const isSectionExpanded = expandedSections[section._id];
                  return (
                    <div key={section._id} className="border-b border-white/5 last:border-none">
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section._id)}
                        className="flex w-full items-center justify-between bg-[#141221]/40 px-6 py-4 transition-colors hover:bg-[#141221]/60"
                      >
                        <div className="flex items-center gap-3">
                          {isSectionExpanded ? <FaChevronUp className="text-[#7C3AED] text-sm" /> : <FaChevronDown className="text-gray-400 text-sm" />}
                          <span className="font-semibold text-sm text-left text-white">{section.sectionName}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {section.subSection?.length || 0} lectures
                        </span>
                      </button>

                      {/* Section Contents (Lectures) */}
                      {isSectionExpanded && (
                        <div className="bg-[#0B0A10]/40 px-6 py-2">
                          {section.subSection?.length > 0 ? (
                            section.subSection.map((subSec) => (
                              <div key={subSec._id} className="flex items-center justify-between py-3 border-b border-white/[0.02] last:border-none text-sm text-gray-300">
                                <div className="flex items-center gap-3">
                                  <FaCirclePlay className="text-[#7C3AED]/70" />
                                  <span className="font-medium">{subSec.title}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <FiClock />
                                    <span>{subSec.timeDuration || "0m"}</span>
                                  </div>
                                  {!isEnrolled && <FaLock className="text-gray-600 text-[10px]" />}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500 py-3 pl-7">No lectures in this section yet.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructor Details */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Instructor</h2>
              <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-[#141221]/30 p-6 backdrop-blur-md">
                <img
                  src={courseData?.instructor?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${courseData?.instructor?.firstName}`}
                  alt={`${courseData?.instructor?.firstName}`}
                  className="h-16 w-16 rounded-full object-cover border border-[#7C3AED]/30"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-lg text-white">
                    {courseData?.instructor?.firstName} {courseData?.instructor?.lastName}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {courseData?.instructor?.email}
                  </p>
                  {courseData?.instructor?.additionalDetails?.about && (
                    <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                      {courseData?.instructor?.additionalDetails?.about}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Purchase Card */}
          <div className="lg:w-4/12 relative">
            <div className="lg:sticky lg:top-24 flex flex-col gap-6 rounded-2xl border border-white/5 bg-[#141221]/80 p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              
              {/* Thumbnail */}
              <div className="overflow-hidden rounded-xl border border-white/5 aspect-video relative group/thumb">
                <img
                  src={courseData?.thumbnail}
                  alt={courseData?.courseName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                />
              </div>

              {/* Pricing & CTA */}
              <div className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-white">
                    ₹{courseData?.price?.toLocaleString("en-IN") || 0}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  {isEnrolled ? (
                    <button
                      onClick={handleGotoCourse}
                      className="w-full rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] py-3.5 text-sm font-semibold text-white shadow-lg transition-transform duration-200 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                    >
                      Go to Course
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleBuyNow}
                        className="w-full rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] py-3.5 text-sm font-semibold text-white shadow-lg transition-transform duration-200 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                      >
                        Buy Now
                      </button>

                      {isInCart ? (
                        <button
                          onClick={handleRemoveFromCart}
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:border-red-500/20"
                        >
                          Remove from Cart
                        </button>
                      ) : (
                        <button
                          onClick={handleAddToCart}
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 hover:border-white/20"
                        >
                          Add to Cart
                        </button>
                      )}
                    </>
                  )}
                </div>

                <p className="text-[10px] text-center text-gray-500 font-medium">
                  30-Day Money-Back Guarantee • Lifetime Access
                </p>
              </div>

              {/* Features List */}
              <div className="border-t border-white/5 pt-4 flex flex-col gap-3 text-sm text-gray-300">
                <p className="font-semibold text-white text-xs tracking-wide uppercase text-gray-400">
                  This course includes:
                </p>
                <div className="flex items-center gap-3">
                  <FiClock className="text-[#A78BFA]" />
                  <span>Full Lifetime Access</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiFileText className="text-[#A78BFA]" />
                  <span>Access on Mobile and TV</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCirclePlay className="text-[#A78BFA]" />
                  <span>{totalLectures} Lectures</span>
                </div>
              </div>

              {/* Action buttons (Share) */}
              <div className="flex justify-center border-t border-white/5 pt-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-xs font-semibold text-[#A78BFA] hover:text-white transition-colors py-1.5"
                >
                  <FaShareFromSquare size={13} />
                  <span>Share this course</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

// --- Loading Skeleton ---
const CourseDetailsSkeleton = () => (
  <div className="min-h-screen bg-[#0A0B10] text-white animate-pulse">
    <div className="bg-[#141221]/50 py-16">
      <div className="mx-auto flex w-11/12 max-w-maxContent flex-col gap-4">
        <div className="h-4 w-48 rounded bg-white/10" />
        <div className="h-9 w-96 rounded bg-white/10 mt-2" />
        <div className="h-4 w-full max-w-[600px] rounded bg-white/5 mt-1" />
        <div className="h-5 w-72 rounded bg-white/5 mt-3" />
      </div>
    </div>
    <div className="mx-auto w-11/12 max-w-maxContent py-12 flex gap-10">
      <div className="w-8/12 flex flex-col gap-8">
        <div className="h-[200px] rounded-2xl bg-white/5" />
        <div className="h-[300px] rounded-2xl bg-white/5" />
      </div>
      <div className="w-4/12">
        <div className="h-[400px] rounded-2xl bg-white/5" />
      </div>
    </div>
  </div>
);

export default CourseDetails;
