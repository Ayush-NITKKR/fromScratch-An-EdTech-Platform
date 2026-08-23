import { useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { createCategory } from "../../services/courseDetailsAPI"

export default function AddCategory() {
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    const result = await createCategory(
      {
        name: data.categoryName,
        description: data.categoryDesc,
      },
      token
    )
    if (result) {
      reset()
    }
    setLoading(false)
  }

  return (
    <div className="w-full">
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Add Category
      </h1>
      
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 sm:p-8"
      >
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="categoryName">
            Category Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="categoryName"
            placeholder="Enter Category Name"
            {...register("categoryName", { required: true })}
            className="w-full rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
          />
          {errors.categoryName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Category name is required
            </span>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="categoryDesc">
            Category Description <sup className="text-pink-200">*</sup>
          </label>
          <textarea
            id="categoryDesc"
            placeholder="Enter Category Description"
            {...register("categoryDesc", { required: true })}
            className="min-h-[130px] w-full rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none"
          />
          {errors.categoryDesc && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Category description is required
            </span>
          )}
        </div>

        <div className="flex justify-end gap-x-2">
          <button
            type="submit"
            disabled={loading}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-yellow-50 py-2 px-5 font-semibold text-richblack-900 hover:bg-yellow-100 transition-colors"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  )
}
