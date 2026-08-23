import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { fetchInstructorCourses } from "../../services/courseDetailsAPI"
import { FiLoader } from "react-icons/fi"
import { Link } from "react-router-dom"

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true)
      const instructorCourses = await fetchInstructorCourses(token)
      if (instructorCourses) {
        setCourses(instructorCourses)
      }
      setLoading(false)
    }
    getCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalAmount = courses?.reduce((acc, course) => acc + (course.price || 0), 0)
  const totalStudents = courses?.reduce((acc, course) => acc + (course.studentsEnrolled?.length || 0), 0)

  return (
    <div className="text-white w-full">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <FiLoader className="text-[#7C3AED] animate-spin text-3xl" />
        </div>
      ) : courses.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2 rounded-md bg-richblack-800 p-6 border border-richblack-700">
              <p className="text-lg text-richblack-200">Total Courses</p>
              <p className="text-3xl font-semibold text-richblack-5">
                {courses.length}
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-md bg-richblack-800 p-6 border border-richblack-700">
              <p className="text-lg text-richblack-200">Total Students</p>
              <p className="text-3xl font-semibold text-richblack-5">
                {totalStudents}
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-md bg-richblack-800 p-6 border border-richblack-700">
              <p className="text-lg text-richblack-200">Total Income</p>
              <p className="text-3xl font-semibold text-richblack-5">
                Rs. {totalAmount}
              </p>
            </div>
          </div>

          <div className="rounded-md bg-richblack-800 p-6 border border-richblack-700 mt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-yellow-50">View all</p>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="flex flex-col gap-2 rounded-lg border border-richblack-700 bg-richblack-900/50 p-4">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[150px] w-full rounded-md object-cover"
                  />
                  <div className="mt-2 flex flex-col gap-1">
                    <p className="text-sm font-semibold text-richblack-5">
                      {course.courseName}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-richblack-300">
                        {course.studentsEnrolled?.length || 0} students
                      </p>
                      <p className="text-xs text-richblack-300">|</p>
                      <p className="text-xs text-richblack-300">
                        Rs. {course.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20 border border-richblack-700 text-center">
          <p className="text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-4 text-lg font-semibold text-yellow-50 underline">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  )
}
