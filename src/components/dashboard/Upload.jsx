import { useEffect, useRef, useState } from "react"
import { FiUploadCloud } from "react-icons/fi"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  editData = null,
  video = false,
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(editData ? editData : "")
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      // Validate file type
      const isVideo = file.type.startsWith("video/")
      if (video && !isVideo) {
        alert("Please drop a video file")
        return
      }
      if (!video && isVideo) {
        alert("Please drop an image file")
        return
      }
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      previewFile(file)
      setSelectedFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  useEffect(() => {
    register(name, { required: !editData })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register])

  useEffect(() => {
    setValue(name, selectedFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5 font-medium" htmlFor={name}>
        {label} {!editData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`${
          isDragActive ? "bg-richblack-700 border-yellow-500" : "bg-richblack-800 border-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dashed p-6 transition-all duration-300`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={video ? "video/*" : "image/*"}
          className="hidden"
        />
        {previewSource ? (
          <div
            className="flex w-full flex-col p-2 items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Stop triggering click on parent
          >
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover max-h-[300px]"
              />
            ) : (
              <video
                src={previewSource}
                controls
                className="h-full w-full rounded-md object-cover max-h-[300px]"
              />
            )}
            <button
              type="button"
              onClick={() => {
                setPreviewSource("")
                setSelectedFile(null)
                setValue(name, null)
              }}
              className="mt-3 text-sm text-richblack-400 hover:text-pink-200 underline transition-all font-medium cursor-pointer"
            >
              Cancel / Upload new
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-6 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-richblack-900 text-yellow-50 mb-3">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="text-sm text-richblack-200">
              Drag and drop a {video ? "video" : "image"}, or{" "}
              <span className="font-semibold text-yellow-50">Browse</span> a file
            </p>
            <ul className="mt-4 flex justify-center gap-x-8 text-xs text-richblack-400">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
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
