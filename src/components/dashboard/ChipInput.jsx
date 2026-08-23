import { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)
  const [chips, setChips] = useState([])

  useEffect(() => {
    if (editCourse && course) {
      setChips(course?.tag || [])
    }
    register(name, { required: true, validate: (val) => val.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, chips)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      const chipValue = event.target.value.trim()
      if (chipValue && !chips.includes(chipValue)) {
        setChips([...chips, chipValue])
        event.target.value = ""
      }
    }
  }

  const handleDeleteChip = (chipIndex) => {
    const newChips = chips.filter((_, index) => index !== chipIndex)
    setChips(newChips)
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5 font-medium" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col gap-2 rounded-md border border-richblack-700 bg-richblack-800 p-3">
        {/* Render chips */}
        <div className="flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <div
              key={index}
              className="flex items-center gap-x-2 rounded-full bg-yellow-400/20 border border-yellow-500/30 px-3 py-1 text-sm font-semibold text-yellow-50"
            >
              <span>{chip}</span>
              <button
                type="button"
                onClick={() => handleDeleteChip(index)}
                className="text-yellow-400 hover:text-yellow-200 transition-colors"
              >
                <MdClose className="text-sm font-bold" />
              </button>
            </div>
          ))}
        </div>
        {/* Main Input */}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-richblack-5 text-sm w-full focus:ring-0 focus:outline-none p-1 placeholder-richblack-400"
        />
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
