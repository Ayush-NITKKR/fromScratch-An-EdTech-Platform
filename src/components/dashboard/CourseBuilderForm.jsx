import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext, MdModeEdit, MdDelete } from "react-icons/md"
import { RiPlayList2Line } from "react-icons/ri"
import { VscChevronDown, VscChevronUp } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { setCourse, setEditCourse, setStep } from "../../store/courseSlice"
import {
  createSection,
  updateSection,
  deleteSection,
  deleteSubSection,
} from "../../services/courseDetailsAPI"
import SubSectionModal from "./SubSectionModal"

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)

  // Track state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({})
  // Track edit mode for section names: { [sectionId]: boolean }
  const [editSectionId, setEditSectionId] = useState(null)
  
  // Track subsection modal state
  const [addSubSection, setAddSubSection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const cancelEditSection = () => {
    setEditSectionId(null)
    setValue("sectionName", "")
  }

  const onSubmit = async (data) => {
    setLoading(true)
    let result

    if (editSectionId) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionId,
          courseId: course._id,
        },
        token
      )
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      )
    }

    if (result) {
      dispatch(setCourse(result))
      setEditSectionId(null)
      setValue("sectionName", "")
    }
    setLoading(false)
  }

  const handleEditSectionName = (sectionId, sectionName) => {
    if (editSectionId === sectionId) {
      cancelEditSection()
      return
    }
    setEditSectionId(sectionId)
    setValue("sectionName", sectionName)
  }

  const handleDeleteSection = async (sectionId) => {
    setLoading(true)
    const result = await deleteSection(
      {
        sectionId,
        courseId: course._id,
      },
      token
    )
    if (result) {
      dispatch(setCourse(result))
    }
    setLoading(false)
  }

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    setLoading(true)
    const result = await deleteSubSection(
      {
        subSectionId,
        sectionId,
      },
      token
    )
    if (result) {
      dispatch(setCourse(result))
    }
    setLoading(false)
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add at least one section")
      return
    }
    if (
      course.courseContent.some(
        (section) => section.subSection.length === 0
      )
    ) {
      toast.error("Please add at least one lecture in each section")
      return
    }
    dispatch(setStep(3))
  }

  return (
    <div className="space-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 text-white">
      <p className="text-2xl font-semibold">Course Builder</p>

      {/* Section Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>
        <div className="flex items-end gap-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex cursor-pointer items-center gap-x-2 rounded-md border border-yellow-500 bg-transparent py-2 px-5 font-semibold text-yellow-50 hover:bg-yellow-500/10 transition-colors"
          >
            <span>{editSectionId ? "Edit Section Name" : "Create Section"}</span>
            <IoAddCircleOutline className="text-xl text-yellow-50" />
          </button>
          {editSectionId && (
            <button
              type="button"
              onClick={cancelEditSection}
              className="text-sm text-richblack-300 underline cursor-pointer hover:text-richblack-5 transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Nested Section/Subsection Viewer */}
      {course?.courseContent?.length > 0 && (
        <div className="rounded-lg bg-richblack-900 p-6 border border-richblack-700">
          {course.courseContent.map((section) => {
            const isExpanded = !!expandedSections[section._id]
            return (
              <div
                key={section._id}
                className="border-b border-richblack-700/50 py-3 last:border-none"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between gap-x-3">
                  <div
                    onClick={() => toggleSection(section._id)}
                    className="flex items-center gap-x-2 cursor-pointer flex-1"
                  >
                    <RiPlayList2Line className="text-xl text-richblack-300" />
                    <p className="font-semibold text-richblack-5 hover:text-yellow-50 transition-colors">
                      {section.sectionName}
                    </p>
                    {isExpanded ? (
                      <VscChevronUp className="text-richblack-300" />
                    ) : (
                      <VscChevronDown className="text-richblack-300" />
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-x-3">
                    <button
                      onClick={() =>
                        handleEditSectionName(section._id, section.sectionName)
                      }
                      className="text-richblack-300 hover:text-yellow-50 transition-colors cursor-pointer"
                    >
                      <MdModeEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section._id)}
                      className="text-richblack-300 hover:text-pink-200 transition-colors cursor-pointer"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>

                {/* Subsections List (Lectures) */}
                {isExpanded && (
                  <div className="mt-3 pl-6 space-y-2">
                    {section.subSection?.map((subSec) => (
                      <div
                        key={subSec._id}
                        className="flex items-center justify-between gap-x-3 rounded-md bg-richblack-800 px-4 py-2 border border-richblack-700/30"
                      >
                        <div
                          onClick={() => setViewSubSection(subSec)}
                          className="flex items-center gap-x-2 cursor-pointer flex-1"
                        >
                          <RiPlayList2Line className="text-sm text-yellow-50" />
                          <p className="text-sm text-richblack-50 hover:text-yellow-50 transition-colors font-medium">
                            {subSec.title}
                          </p>
                        </div>
                        {/* Subsection Actions */}
                        <div className="flex items-center gap-x-3">
                          <button
                            onClick={() =>
                              setEditSubSection({
                                ...subSec,
                                sectionId: section._id,
                              })
                            }
                            className="text-richblack-300 hover:text-yellow-50 transition-colors cursor-pointer"
                          >
                            <MdModeEdit size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteSubSection(subSec._id, section._id)
                            }
                            className="text-richblack-300 hover:text-pink-200 transition-colors cursor-pointer"
                          >
                            <MdDelete size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Add Lecture Button */}
                    <button
                      type="button"
                      onClick={() => setAddSubSection(section._id)}
                      className="mt-2 flex items-center gap-x-1 font-semibold text-yellow-50 hover:text-yellow-250 transition-colors cursor-pointer text-sm"
                    >
                      <IoAddCircleOutline className="text-lg" />
                      <span>Add Lecture</span>
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-x-3 pt-6">
        <button
          type="button"
          onClick={goBack}
          className="rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50 hover:bg-richblack-600 cursor-pointer transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-yellow-500 py-2 px-5 font-semibold text-richblack-900 hover:bg-yellow-400 transition-colors"
        >
          <span>Next</span>
          <MdNavigateNext className="text-xl" />
        </button>
      </div>

      {/* Render Subsection Modals */}
      {addSubSection && (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
        />
      )}
      {viewSubSection && (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      )}
      {editSubSection && (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      )}
    </div>
  )
}
