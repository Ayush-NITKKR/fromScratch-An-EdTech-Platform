import { useEffect, useState } from "react"

export default function RequirementField({
  name,
  label,
  register,
  errors,
  setValue,
  getValues,
  editData = [],
}) {
  const [requirement, setRequirement] = useState("")
  const [requirementList, setRequirementList] = useState(editData)

  useEffect(() => {
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, requirementList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementList])

  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementList([...requirementList, requirement])
      setRequirement("")
    }
  }

  const handleRemoveRequirement = (index) => {
    const updatedList = requirementList.filter((_, i) => i !== index)
    setRequirementList(updatedList)
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5 font-medium" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
        <div className="flex w-full items-center gap-x-2">
          <input
            type="text"
            id={name}
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Enter requirements of the course"
            className="form-style w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddRequirement()
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddRequirement}
            className="font-semibold text-yellow-50 hover:text-yellow-250 transition-colors cursor-pointer px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-md hover:bg-yellow-500/20"
          >
            Add
          </button>
        </div>

        {requirementList.length > 0 && (
          <ul className="mt-2 list-inside list-disc space-y-1 w-full pl-2">
            {requirementList.map((req, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-sm text-richblack-100 py-1"
              >
                <span>{req}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(index)}
                  className="text-xs text-pure-greys-300 hover:text-pink-200 transition-colors underline cursor-pointer"
                >
                  clear
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}