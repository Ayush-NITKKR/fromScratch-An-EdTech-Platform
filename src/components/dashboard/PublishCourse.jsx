import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { resetCourseState, setStep } from "../../store/courseSlice"
import { editCourseDetails } from "../../services/courseDetailsAPI"
import { COURSE_STATUS } from "../../utils/constants"

export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goBack = () => {
    dispatch(setStep(2))
  }

  const handlePublishCourse = async (data) => {
    const currentStatus = course?.status
    const targetStatus = data.public ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT

    // If status hasn't changed, just navigate to my-profile
    if (currentStatus === targetStatus) {
      dispatch(resetCourseState())
      navigate("/dashboard/my-profile")
      return
    }

    const formData = new FormData()
    formData.append("courseId", course._id)
    formData.append("status", targetStatus)

    setLoading(true)
    const result = await editCourseDetails(formData, token)
    if (result) {
      dispatch(resetCourseState())
      navigate("/dashboard/my-profile")
    }
    setLoading(false)
  }

  const onSubmit = (data) => {
    handlePublishCourse(data)
  }

  return (
    <div className="rounded-md border border-richblack-700 bg-richblack-800 p-6 text-white max-w-[600px] mx-auto">
      <p className="text-2xl font-semibold">Publish Settings</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        {/* Checkbox */}
        <div className="flex items-center gap-x-3">
          <input
            type="checkbox"
            id="public"
            {...register("public")}
            className="h-4 w-4 rounded border-richblack-700 bg-richblack-900 text-yellow-500 focus:ring-yellow-500 cursor-pointer"
          />
          <label htmlFor="public" className="text-richblack-5 font-medium cursor-pointer">
            Make this course public
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-x-3 pt-4 border-t border-richblack-700">
          <button
            type="button"
            disabled={loading}
            onClick={goBack}
            className="rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 hover:bg-richblack-600 transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-yellow-500 py-2 px-5 font-semibold text-richblack-900 hover:bg-yellow-400 transition-colors cursor-pointer"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}
