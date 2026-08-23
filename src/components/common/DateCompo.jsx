import { useState, useRef, useEffect } from "react";

const DatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = value ? new Date(value) : null;
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleSelect = (day) => {
    const newDate = new Date(year, month, day);
    // Format as YYYY-MM-DD to match native date input / backend expectations
    const formatted = newDate.toISOString().split("T")[0];
    onChange({ target: { name: "dateofBirth", value: formatted } });
    setIsOpen(false);
  };

  const changeMonth = (delta) => {
    setViewDate(new Date(year, month + delta, 1));
  };

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-GB")
    : "Select date";

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-left focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-colors"
      >
        <span className={selectedDate ? "text-white" : "text-gray-500"}>
          {displayValue}
        </span>
        <svg className="w-4 h-4 text-[#7C3AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-[280px] bg-[#111111] border border-[#2a2a2a] rounded-lg p-3 z-10 shadow-lg">
          <div className="flex justify-between items-center mb-2.5">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="text-gray-400 hover:text-white p-1"
            >
              ‹
            </button>
            <span className="text-white text-sm font-medium">
              {viewDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="text-gray-400 hover:text-white p-1"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="text-gray-500 text-xs py-1.5">
                {d}
              </div>
            ))}

            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const isSelected =
                selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

              return (
                <div
                  key={day}
                  onClick={() => handleSelect(day)}
                  className={`py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#7C3AED] text-white"
                      : "text-gray-200 hover:bg-[#1a1a1a]"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;