export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white/10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-700 bg-richblack-800 p-6 text-white shadow-2xl">
        <p className="text-xl font-semibold text-richblack-5">
          {modalData.text1}
        </p>
        <p className="mt-3 mb-5 text-sm text-richblack-300">
          {modalData.text2}
        </p>
        <div className="flex items-center gap-x-4">
          <button
            onClick={modalData?.btn1Handler}
            className="flex cursor-pointer items-center justify-center rounded-md bg-yellow-500 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-yellow-400 transition-colors"
          >
            {modalData?.btn1Text}
          </button>
          <button
            onClick={modalData?.btn2Handler}
            className="flex cursor-pointer items-center justify-center rounded-md bg-richblack-700 py-[8px] px-[20px] font-semibold text-richblack-50 hover:bg-richblack-600 border border-richblack-600 transition-colors"
          >
            {modalData?.btn2Text || modalData?.btn2text}
          </button>
        </div>
      </div>
    </div>
  )
}