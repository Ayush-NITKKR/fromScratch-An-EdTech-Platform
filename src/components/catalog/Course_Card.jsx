import React, { useEffect, useState } from 'react'
import RatingStars from '../common/RatingStars'
import GetAvgRating from '../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({ course, Height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReview);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <div className="group h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#141221]/40 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6),0_0_20px_rgba(124,58,237,0.05)] hover:bg-[#141221]/70">
      <Link to={`/courses/${course?._id}`} className="flex flex-col h-full">
        {/* Thumbnail Area */}
        <div className={`relative overflow-hidden ${Height || "h-[200px]"}`}>
          <img
            src={course?.thumbnail}
            alt={`${course?.courseName} thumbnail`}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {/* Subtle overlay glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A10]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Course Info */}
        <div className="flex flex-col flex-grow p-5 gap-3">
          {/* Course Name */}
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-white group-hover:text-[#A78BFA] transition-colors duration-200">
            {course?.courseName}
          </h3>

          {/* Instructor Name */}
          <p className="text-xs font-medium text-gray-400">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </p>

          {/* Ratings & Stars */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-amber-400">{avgReviewCount || 0}</span>
            <RatingStars Review_Count={avgReviewCount} Star_Size={16} />
            <span className="text-xs text-gray-500 font-medium">
              ({course?.ratingAndReview?.length || 0} Ratings)
            </span>
          </div>

          {/* Pricing */}
          <div className="mt-auto pt-2 flex items-center justify-between border-t border-white/5">
            <p className="text-lg font-bold text-white">
              ₹{course?.price?.toLocaleString('en-IN') || 0}
            </p>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#7C3AED] bg-[#7C3AED]/10 px-2.5 py-1 rounded-full">
              Best Seller
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Course_Card
