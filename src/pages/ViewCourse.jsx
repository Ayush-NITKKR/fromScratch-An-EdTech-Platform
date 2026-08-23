import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCourseDetails } from "../services/courseDetailsAPI";
import { toast } from "react-hot-toast";
import {
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaStar,
  FaRegStar,
  FaRegCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";
import { FiLoader, FiAward } from "react-icons/fi";
import { MdOutlineRateReview } from "react-icons/md";
import RatingStars from "../components/common/RatingStars";
import GetAvgRating from "../utils/avgRating";
import {
  createRating,
  getCourseProgress,
  updateCourseProgress,
} from "../services/courseDetailsAPI";

// ─────────────────────────────────────────────────────────────────────────────
// Rating & Review Modal
// ─────────────────────────────────────────────────────────────────────────────
function RatingReviewModal({ isOpen, onClose, courseName, existingReview }) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState(existingReview?.review || "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 0);
      setReview(existingReview.review || "");
    }
  }, [existingReview]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!rating) { toast.error("Please select a star rating"); return; }
    if (!review.trim()) { toast.error("Please write a review"); return; }
    setSubmitting(true);
    await onClose({ rating, review });
    setSubmitting(false);
  };

  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => onClose(null)} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#141221] p-6 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.9)]">
        <button onClick={() => onClose(null)} className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors">
          <FaTimes />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/20">
            <MdOutlineRateReview className="text-[#A78BFA] text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Rate this Course</h2>
            <p className="text-xs text-gray-400 line-clamp-1">{courseName}</p>
          </div>
        </div>

        {/* Star Selector */}
        <div className="mb-5 flex flex-col items-center gap-2">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                id={`star-btn-${star}`}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                {star <= (hovered || rating) ? (
                  <FaStar className="text-3xl text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                ) : (
                  <FaRegStar className="text-3xl text-gray-600" />
                )}
              </button>
            ))}
          </div>
          {(hovered || rating) > 0 && (
            <p className="text-sm font-medium text-amber-400">{labels[hovered || rating]}</p>
          )}
        </div>

        {/* Review Text */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Your Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this course..."
            rows={4}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-[#7C3AED]/60 focus:ring-1 focus:ring-[#7C3AED]/30"
          />
          <p className="mt-1 text-right text-xs text-gray-500">{review.length}/500</p>
        </div>

        <button
          id="submit-review-btn"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <><FiLoader className="animate-spin" /> Submitting...</> : "Submit Review"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main ViewCourse Page
// ─────────────────────────────────────────────────────────────────────────────
const ViewCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeLecture, setActiveLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [avgReview, setAvgReview] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchCourseDetails(courseId);
        if (result) {
          setCourseData(result);
          setAvgReview(GetAvgRating(result?.ratingAndReview));
          const existingReview = result?.ratingAndReview?.find(
            (item) => item?.user?._id === user?._id || item?.user === user?._id
          );
          setUserReview(existingReview || null);

          if (token) {
            const progress = await getCourseProgress(courseId, token);
            setCompletedLectures(new Set((progress?.completedVideos || []).map((id) => id.toString())));
          }

          if (result.courseContent?.length > 0) {
            const firstSec = result.courseContent[0];
            setExpandedSections({ [firstSec._id]: true });
            if (firstSec.subSection?.length > 0) {
              setActiveLecture({ sectionIdx: 0, subIdx: 0, data: firstSec.subSection[0] });
            }
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load course");
      }
      setLoading(false);
    };
    load();
  }, [courseId, token, user?._id]);

  const toggleSection = (id) =>
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const allLectures = courseData?.courseContent?.flatMap((sec) => sec.subSection) ?? [];
  const totalLectures = allLectures.length;

  const currentLectureGlobalIdx = activeLecture
    ? (courseData?.courseContent?.slice(0, activeLecture.sectionIdx).reduce((acc, sec) => acc + sec.subSection.length, 0) || 0) + activeLecture.subIdx
    : -1;

  const completionPercent = totalLectures > 0 ? Math.round((completedLectures.size / totalLectures) * 100) : 0;

  const toggleComplete = async (lectureId) => {
    if (!token) {
      toast.error("Please log in to save progress");
      return;
    }

    const wasCompleted = completedLectures.has(lectureId);
    setCompletedLectures((prev) => {
      const next = new Set(prev);
      if (next.has(lectureId)) next.delete(lectureId);
      else next.add(lectureId);
      return next;
    });

    const updatedProgress = await updateCourseProgress(courseId, lectureId, token);
    if (updatedProgress?.completedVideos) {
      setCompletedLectures(new Set(updatedProgress.completedVideos.map((id) => id.toString())));
      toast.success(wasCompleted ? "Lecture marked incomplete" : "Lecture marked complete");
    } else {
      setCompletedLectures((prev) => {
        const next = new Set(prev);
        if (wasCompleted) next.add(lectureId);
        else next.delete(lectureId);
        return next;
      });
    }
  };

  const goToLectureByIndex = (idx) => {
    if (!courseData || idx < 0 || idx >= totalLectures) return;
    let count = 0;
    for (let si = 0; si < courseData.courseContent.length; si++) {
      const sec = courseData.courseContent[si];
      for (let subi = 0; subi < sec.subSection.length; subi++) {
        if (count === idx) {
          setActiveLecture({ sectionIdx: si, subIdx: subi, data: sec.subSection[subi] });
          setExpandedSections((prev) => ({ ...prev, [sec._id]: true }));
          return;
        }
        count++;
      }
    }
  };

  const handleReviewClose = async (result) => {
    if (!result) {
      setReviewModalOpen(false);
      return;
    }

    const savedReview = await createRating(
      { courseId, rating: result.rating, review: result.review },
      token
    );

    if (savedReview) {
      setUserReview(savedReview);
      setCourseData((prev) => {
        if (!prev) return prev;
        const reviews = prev.ratingAndReview || [];
        const reviewExists = reviews.some((item) => item._id === savedReview._id);
        const nextReviews = reviewExists
          ? reviews.map((item) => (item._id === savedReview._id ? savedReview : item))
          : [savedReview, ...reviews];
        setAvgReview(GetAvgRating(nextReviews));
        return { ...prev, ratingAndReview: nextReviews };
      });
      setReviewModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0B10]">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent" />
          <p className="text-sm text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#0A0B10] text-white">
        <h1 className="text-2xl font-bold">Course Not Found</h1>
        <button onClick={() => navigate("/dashboard/enrolled-courses")} className="rounded-xl bg-[#7C3AED] px-5 py-2 text-sm hover:bg-[#6D28D9] transition-colors">
          Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0B10] text-white">

      {/* ── Sidebar ── */}
      <aside className="hidden w-[300px] flex-shrink-0 flex-col border-r border-white/5 bg-[#0D0C16] lg:flex overflow-hidden">
        <div className="border-b border-white/5 px-5 py-4">
          <button onClick={() => navigate("/dashboard/enrolled-courses")} className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">
            <FaArrowLeft size={11} /> Back to Dashboard
          </button>
          <h2 className="text-sm font-bold text-white line-clamp-2 leading-snug">{courseData.courseName}</h2>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>{completedLectures.size}/{totalLectures} completed</span>
              <span className="font-semibold text-[#A78BFA]">{completionPercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] transition-all duration-500" style={{ width: `${completionPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          {courseData.courseContent?.map((section, si) => {
            const isExpanded = expandedSections[section._id];
            const sectionDone = section.subSection.filter((s) => completedLectures.has(s._id)).length;
            return (
              <div key={section._id} className="border-b border-white/[0.04] last:border-none">
                <button
                  id={`section-toggle-${section._id}`}
                  onClick={() => toggleSection(section._id)}
                  className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-200 truncate">{section.sectionName}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{sectionDone}/{section.subSection.length} lectures</p>
                  </div>
                  <span className="ml-3 text-gray-500 flex-shrink-0">{isExpanded ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}</span>
                </button>

                {isExpanded && (
                  <div className="pb-1">
                    {section.subSection.map((sub, subi) => {
                      const isActive = activeLecture?.sectionIdx === si && activeLecture?.subIdx === subi;
                      const isDone = completedLectures.has(sub._id);
                      return (
                        <button
                          key={sub._id}
                          id={`lecture-btn-${sub._id}`}
                          onClick={() => setActiveLecture({ sectionIdx: si, subIdx: subi, data: sub })}
                          className={`flex w-full items-start gap-3 px-5 py-2.5 text-left transition-all ${isActive ? "bg-[#7C3AED]/15 border-r-2 border-[#7C3AED]" : "hover:bg-white/[0.03]"}`}
                        >
                          <span className="mt-0.5 flex-shrink-0">
                            {isDone ? <FaCheckCircle className="text-emerald-400 text-sm" /> : <FaRegCircle className={`text-sm ${isActive ? "text-[#A78BFA]" : "text-gray-600"}`} />}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium leading-snug truncate ${isActive ? "text-[#A78BFA]" : isDone ? "text-gray-400" : "text-gray-300"}`}>{sub.title}</p>
                            {sub.timeDuration && <p className="text-[10px] text-gray-600 mt-0.5">{sub.timeDuration}</p>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex flex-1 flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-white/5 bg-[#0D0C16] px-5 py-3 gap-4 flex-shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => navigate("/dashboard/enrolled-courses")} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors lg:hidden">
              <FaArrowLeft size={12} /> Back
            </button>
            <div className="min-w-0 hidden sm:block">
              <p className="text-xs text-gray-500">Lecture {currentLectureGlobalIdx + 1} of {totalLectures}</p>
              <p className="text-sm font-semibold text-white truncate">{activeLecture?.data?.title || "Select a lecture"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {completionPercent === 100 && (
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                <FiAward /> Course Completed! 🎉
              </div>
            )}

            {/* Rate & Review Button */}
            <button
              id="rate-review-btn"
              onClick={() => setReviewModalOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <FaStar size={12} />
              <span className="hidden sm:inline">{userReview ? "Edit Review" : "Rate & Review"}</span>
            </button>

            {/* Mark as Complete (header) */}
            {activeLecture && (
              <button
                id="mark-complete-btn"
                onClick={() => toggleComplete(activeLecture.data._id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  completedLectures.has(activeLecture.data._id)
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                }`}
              >
                {completedLectures.has(activeLecture.data._id) ? <FaCheckCircle size={12} /> : <FaRegCircle size={12} />}
                <span className="hidden sm:inline">{completedLectures.has(activeLecture.data._id) ? "Completed" : "Mark Complete"}</span>
              </button>
            )}
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-y-auto no-scrollbar flex-col">

          {/* Video Player */}
          <div className="w-full bg-black flex items-center justify-center" style={{ minHeight: "40vh", maxHeight: "60vh" }}>
            {activeLecture?.data?.videoUrl ? (
              <video
                ref={videoRef}
                key={activeLecture.data._id}
                src={activeLecture.data.videoUrl}
                controls
                className="h-full w-full object-contain"
                style={{ maxHeight: "60vh" }}
                onEnded={() => {
                  if (!completedLectures.has(activeLecture.data._id)) toggleComplete(activeLecture.data._id);
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-500 py-16">
                <FaCirclePlay size={56} className="opacity-20" />
                <p className="text-sm">{activeLecture ? "No video available for this lecture" : "Select a lecture to begin"}</p>
              </div>
            )}
          </div>

          <div className="mx-auto w-full max-w-4xl px-5 py-6 flex flex-col gap-5">

            {/* Prev / Mark Complete / Next */}
            <div className="flex items-center justify-between gap-3">
              <button
                id="prev-lecture-btn"
                onClick={() => goToLectureByIndex(currentLectureGlobalIdx - 1)}
                disabled={currentLectureGlobalIdx <= 0}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FaArrowLeft size={11} /> Previous
              </button>

              {activeLecture && (
                <button
                  id="mark-complete-center-btn"
                  onClick={() => toggleComplete(activeLecture.data._id)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${
                    completedLectures.has(activeLecture.data._id)
                      ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30"
                      : "bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-lg hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                  }`}
                >
                  {completedLectures.has(activeLecture.data._id) ? <><FaCheckCircle /> Marked Complete</> : <><FaRegCircle /> Mark as Complete</>}
                </button>
              )}

              <button
                id="next-lecture-btn"
                onClick={() => goToLectureByIndex(currentLectureGlobalIdx + 1)}
                disabled={currentLectureGlobalIdx >= totalLectures - 1}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next <FaArrowRight size={11} />
              </button>
            </div>

            {/* Lecture Info */}
            {activeLecture && (
              <div className="rounded-2xl border border-white/5 bg-[#141221]/40 p-5">
                <h1 className="text-xl font-bold text-white mb-2">{activeLecture.data.title}</h1>
                {activeLecture.data.description && (
                  <p className="text-sm text-gray-400 leading-relaxed">{activeLecture.data.description}</p>
                )}
              </div>
            )}

            {/* Progress Card */}
            <div className="rounded-2xl border border-white/5 bg-[#141221]/40 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Your Progress</h3>
                <span className="text-sm font-bold text-[#A78BFA]">{completionPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 mb-2">
                <div className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] transition-all duration-700" style={{ width: `${completionPercent}%` }} />
              </div>
              <p className="text-xs text-gray-500">{completedLectures.size} of {totalLectures} lectures completed</p>

              {completionPercent === 100 && (
                <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
                  <FiAward className="text-emerald-400 text-3xl mx-auto mb-2" />
                  <p className="font-bold text-emerald-400">Congratulations! 🎉</p>
                  <p className="text-xs text-gray-400 mt-1">You've completed this course. Share your experience!</p>
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="mt-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-xs font-semibold text-white hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
                  >
                    Rate & Review Course
                  </button>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            {(courseData.ratingAndReview?.length > 0 || userReview) && (
              <div className="rounded-2xl border border-white/5 bg-[#141221]/40 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Student Reviews</h3>
                  <div className="flex items-center gap-2">
                    <RatingStars Review_Count={avgReview} Star_Size={14} />
                    <span className="text-xs text-gray-400">({courseData.ratingAndReview?.length || 0})</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {courseData.ratingAndReview?.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                      <img
                        src={r.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${r.user?.firstName}`}
                        alt={r.user?.firstName}
                        className="h-8 w-8 rounded-full object-cover border border-white/10 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-xs font-semibold text-gray-200">{r.user?.firstName} {r.user?.lastName}</p>
                          <RatingStars Review_Count={r.rating} Star_Size={11} />
                        </div>
                        {r.review && <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{r.review}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {userReview && (
                  <div className="mt-3 rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 p-3">
                    <p className="text-xs font-semibold text-[#A78BFA] mb-1">Your Review</p>
                    <div className="flex items-center gap-2 mb-1"><RatingStars Review_Count={userReview.rating} Star_Size={12} /></div>
                    <p className="text-xs text-gray-300">{userReview.review}</p>
                  </div>
                )}

                <button
                  id="write-review-btn"
                  onClick={() => setReviewModalOpen(true)}
                  className="mt-4 w-full rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/10 py-2.5 text-xs font-semibold text-[#A78BFA] hover:bg-[#7C3AED]/20 transition-colors flex items-center justify-center gap-2"
                >
                  <MdOutlineRateReview />
                  {userReview ? "Edit Your Review" : "Write a Review"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Rating/Review Modal */}
      <RatingReviewModal
        isOpen={reviewModalOpen}
        onClose={handleReviewClose}
        courseName={courseData.courseName}
        existingReview={userReview}
      />
    </div>
  );
};

export default ViewCourse;
