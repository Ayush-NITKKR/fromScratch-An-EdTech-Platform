import { useState, useRef, useEffect } from "react";

const GenderDropdown = ({ value, onChange ,options}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange({ target: { name: "gender", value: option } });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-left focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors"
      >
        <span className={value ? "text-white" : "text-gray-500"}>
          {value || "Select gender"}
        </span>
        <svg
          className={`w-4 h-4 text-[#7C3AED] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[#111111] border border-[#2a2a2a] rounded-lg overflow-hidden z-10 shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-[#1a1a1a] ${
                value === option ? "text-[#7C3AED] bg-[#1a1a1a]" : "text-gray-200"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenderDropdown;