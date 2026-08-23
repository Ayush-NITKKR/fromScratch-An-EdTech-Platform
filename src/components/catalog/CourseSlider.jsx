import React, { useRef, useState, useEffect } from 'react'
import Course_Card from './Course_Card'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

const CourseSlider = ({ Courses }) => {
  const sliderRef = useRef(null)
  const [showLeftBtn, setShowLeftBtn] = useState(false)
  const [showRightBtn, setShowRightBtn] = useState(false)

  const checkScrollLimits = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      setShowLeftBtn(scrollLeft > 5)
      // Allow a small buffer for precision errors in browser zoom/scaling
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 5)
    }
  }

  useEffect(() => {
    checkScrollLimits()
    window.addEventListener('resize', checkScrollLimits)
    return () => window.removeEventListener('resize', checkScrollLimits)
  }, [Courses])

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (!Courses || Courses.length === 0) {
    return (
      <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium text-gray-300">No courses available</p>
          <p className="text-sm text-gray-500">Check back later or explore another category.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group w-full">
      {/* Left Navigation Arrow */}
      {showLeftBtn && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0B0A10]/80 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[#7C3AED] hover:border-[#7C3AED] focus:outline-none"
          aria-label="Scroll left"
        >
          <FaChevronLeft size={16} />
        </button>
      )}

      {/* Right Navigation Arrow */}
      {showRightBtn && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0B0A10]/80 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-[#7C3AED] hover:border-[#7C3AED] focus:outline-none"
          aria-label="Scroll right"
        >
          <FaChevronRight size={16} />
        </button>
      )}

      {/* Slider Container */}
      <div
        ref={sliderRef}
        onScroll={checkScrollLimits}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 pt-2 no-scrollbar snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {Courses.map((course, index) => (
          <div
            key={course._id || index}
            className="w-[280px] sm:w-[320px] shrink-0 snap-start transition-transform duration-300 hover:scale-[1.01]"
          >
            <Course_Card course={course} Height={"h-[200px]"} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseSlider