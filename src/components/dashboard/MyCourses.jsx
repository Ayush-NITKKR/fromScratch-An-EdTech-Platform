import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { MdModeEdit, MdDelete, MdAccessTime } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  fetchInstructorCourses,
  deleteCourse,
} from "../../services/courseDetailsAPI"
import { resetCourseState, setCourse, setEditCourse, setStep } from "../../store/courseSlice"
import ConfirmationModal from "../common/ConfirmationModal"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const fetchCourses = async () => {
    setLoading(true)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    await deleteCourse({ courseId }, token)
    setConfirmationModal(null)
    await fetchCourses()
    setLoading(false)
  }

  const handleEditCourse = (course) => {
    dispatch(setCourse(course))
    dispatch(setEditCourse(true))
    dispatch(setStep(1))
    navigate("/dashboard/add-course")
  }

  const handleAddCourseRedirect = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/add-course")
  }

  // Helper to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="space-y-6 text-white w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <button
          onClick={handleAddCourseRedirect}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-yellow-500 py-2 px-5 font-semibold text-richblack-900 hover:bg-yellow-400 transition-colors"
        >
          <span>Add Course</span>
          <VscAdd size={20} />
        </button>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-richblack-700 bg-richblack-800 text-center p-6">
          <p className="text-lg text-richblack-200">You haven't created any courses yet</p>
          <button
            onClick={handleAddCourseRedirect}
            className="mt-4 text-yellow-50 hover:text-yellow-200 transition-colors font-medium underline"
          >
            Create your first course now
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-richblack-700 bg-richblack-800 overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-richblack-700 bg-richblack-900/50 text-sm font-semibold text-richblack-300">
                <th className="p-5">Courses</th>
                <th className="p-5">Duration</th>
                <th className="p-5">Price</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                // Calculate total duration (sum of video lecture times)
                let totalLectures = 0
                course.courseContent?.forEach((section) => {
                  totalLectures += section.subSection?.length || 0
                })

                return (
                  <tr
                    key={course._id}
                    className="border-b border-richblack-700/50 transition-colors hover:bg-richblack-900/10 last:border-none"
                  >
                    {/* Course details */}
                    <td className="flex gap-x-4 p-5 max-w-[500px]">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="h-[148px] w-[220px] rounded-lg object-cover border border-richblack-700/30"
                      />
                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <p className="text-lg font-semibold text-richblack-5">
                            {course.courseName}
                          </p>
                          <p className="mt-1 text-xs text-richblack-300 line-clamp-3">
                            {course.courseDescription}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                          <p className="text-[12px] text-white flex items-center gap-1">
                            Created: {formatDate(course.createdAt)}
                          </p>
                          {course.status === "Published" ? (
                            <span className="w-fit rounded-full bg-caribbeangreen-400/20 border border-caribbeangreen-400/40 px-3 py-1 text-xs font-semibold text-caribbeangreen-50">
                              Published
                            </span>
                          ) : (
                            <span className="w-fit rounded-full bg-pink-500/20 border border-pink-500/40 px-3 py-1 text-xs font-semibold text-pink-100">
                              Draft
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Duration details */}
                    <td className="p-5 align-middle text-sm text-richblack-300">
                      <div className="flex items-center gap-1.5">
                        <MdAccessTime className="text-lg" />
                        <span>{totalLectures} Lectures</span>
                      </div>
                    </td>

                    {/* Price details */}
                    <td className="p-5 align-middle text-sm font-semibold text-yellow-50">
                      ₹{course.price}
                    </td>

                    {/* Actions */}
                    <td className="p-5 align-middle text-center">
                      <div className="flex justify-center items-center gap-x-3">
                        <button
                          onClick={() => handleEditCourse(course)}
                          title="Edit"
                          className="rounded-full p-2 text-richblack-300 hover:bg-richblack-700 hover:text-yellow-50 transition-all cursor-pointer"
                        >
                          <MdModeEdit size={20} />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmationModal({
                              text1: "Do you want to delete this course?",
                              text2: "All the sections and lectures will be deleted permanently.",
                              btn1Text: "Delete",
                              btn2Text: "Cancel",
                              btn1Handler: () => handleCourseDelete(course._id),
                              btn2Handler: () => setConfirmationModal(null),
                            })
                          }
                          title="Delete"
                          className="rounded-full p-2 text-richblack-300 hover:bg-richblack-700 hover:text-pink-200 transition-all cursor-pointer"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}
