import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getUserEnrollCourses } from "../../services/profileAPI"
import { FiLoader } from "react-icons/fi"
import { FaPlay } from "react-icons/fa"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [loading, setLoading] = useState(false)

  const getCourses = async () => {
    setLoading(true)
    try {
      const response = await getUserEnrollCourses(token)
      setEnrolledCourses(response || [])
    } catch (error) {
      console.log("Unable to fetch enrolled courses:", error)
      setEnrolledCourses([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (token) {
      getCourses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className="space-y-6 text-white w-full">
      <h1 className="text-3xl font-medium text-richblack-5">Enrolled Courses</h1>

      {!enrolledCourses ? (
        <div className="flex h-[300px] items-center justify-center">
          <FiLoader className="text-yellow-50 animate-spin text-3xl" />
        </div>
      ) : enrolledCourses.length === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-richblack-700 bg-richblack-800 text-center p-6">
          <p className="text-lg text-richblack-200">You have not enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-richblack-700 bg-richblack-800 overflow-hidden">
          {/* Header row */}
          <div className="flex border-b border-richblack-700 bg-richblack-900/50 p-5 text-sm font-semibold text-richblack-300">
            <div className="w-[45%]">Course Name</div>
            <div className="w-[25%]">Durations</div>
            <div className="w-[30%]">Progress</div>
          </div>
          {/* Course rows */}
          <div className="divide-y divide-richblack-700/50">
            {enrolledCourses.map((course, index) => {
              // Calculate total lectures (mock duration)
              let totalLectures = 0
              course.courseContent?.forEach((section) => {
                totalLectures += section.subSection?.length || 0
              })

              // Progress percentage mock/calculated
              const progressPercentage = course.progressPercentage || 0

              return (
                <div key={index} className="flex p-5 items-center hover:bg-richblack-900/10 transition-colors">
                  {/* Info */}
                  <div className="flex w-[45%] items-center gap-x-4">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="h-[64px] w-[100px] rounded-lg object-cover border border-richblack-700/30"
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-richblack-5">{course.courseName}</p>
                      <p className="text-xs text-richblack-300 line-clamp-1 mt-1">
                        {course.courseDescription}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="w-[25%] text-sm text-richblack-300">
                    {totalLectures} Lectures
                  </div>

                  {/* Progress bar */}
                  <div className="flex w-[30%] flex-col gap-y-2">
                    <p className="text-xs text-richblack-200">Progress: {progressPercentage}%</p>
                    <div className="h-2 w-[80%] rounded-full bg-richblack-700">
                      <div
                        className="h-full rounded-full bg-yellow-500 transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <button
                      onClick={() => navigate(`/dashboard/view-course/${course._id}`)}
                      className="mt-1 flex w-fit items-center gap-1.5 rounded-lg bg-[#7C3AED]/20 border border-[#7C3AED]/30 px-3 py-1.5 text-xs font-semibold text-[#A78BFA] hover:bg-[#7C3AED]/30 transition-colors"
                    >
                      <FaPlay size={9} />
                      Continue Learning
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}