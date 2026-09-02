import React from "react";
import { FaCheck } from "react-icons/fa6";
import { useSelector } from "react-redux";
import CourseInformationForm from "./CourseInformationForm"
import CourseBuilderForm from "./CourseBuilderForm";
import PublishCourse from "./PublishCourse";

const RenderSteps = () => {
  const { step } = useSelector((state) => state.course);

  const steps = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish" },
  ];

  return (
    <div>
    <div className="w-full flex justify-center py-6">
      <div className="flex w-full max-w-3xl items-start justify-between px-2 sm:px-8">
        {steps.map((item, index) => (
          <React.Fragment key={item.id}>
            {/* Step Node Container */}
            <div className="flex flex-col items-center w-[100px] sm:w-32 shrink-0">
              
              {/* Circle Indicator */}
              <div
                className={`grid place-items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-500 ease-in-out ${
                  step > item.id
                    ? "bg-yellow-500 border-yellow-500 text-black" // Completed: Solid Yellow
                    : step === item.id
                    ? "border-yellow-500 bg-transparent text-yellow-500 scale-110 shadow-[0_0_12px_rgba(234,179,8,0.4)]" // Active: Hollow Yellow + Glow effect
                    : "border-gray-700 bg-gray-800 text-gray-500" // Upcoming: Gray
                }`}
              >
                {step > item.id ? (
                  <FaCheck className="font-bold text-md sm:text-lg animate-pulse" />
                ) : (
                  <span className="font-semibold text-md sm:text-lg">{item.id}</span>
                )}
              </div>

              {/* Step Title */}
              <div className="mt-4 text-center">
                <p
                  className={`text-xs sm:text-sm font-medium tracking-wide transition-colors duration-300 ${
                    step >= item.id ? "text-gray-100" : "text-gray-500"
                  }`}
                >
                  {item.title}
                </p>
              </div>
            </div>

            {/* Connecting Dashed Line */}
            {index !== steps.length - 1 && (
              <div
                // mt-[19px] for mobile (10px radius), mt-[23px] for desktop (12px radius)
                className={`flex-1 h-[2px] mt-[19px] sm:mt-[23px] mx-2 sm:mx-4 border-dashed border-b-2 transition-all duration-700 ease-in-out ${
                  step > item.id ? "border-yellow-500" : "border-gray-700"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

    </div>
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
</div>
  );
};

export default RenderSteps;