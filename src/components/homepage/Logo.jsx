import { useState } from "react";

export default function Logo() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="/"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl no-underline transition-all duration-300 hover:bg-purple-500/10"
    >
      {/* Flame - Added inline-block so transform works */}
      <span
        className="text-[26px] select-none transition-all duration-300 inline-block"
        style={{
          transform: hovered ? "scale(1.25) rotate(-6deg)" : "scale(1) rotate(0deg)",
          filter: hovered ? "drop-shadow(0 0 8px #a855f7)" : "none",
        }}
      >
        🔥
      </span>

      {/* Text */}
      <span className="relative font-bold text-[22px] leading-none text-white">
        <span
          className="transition-colors duration-300"
          style={{ color: hovered ? "rgba(255,255,255,0.6)" : "#ffffff" }}
        >
          from
        </span>
        <span
          className="transition-all duration-300 inline-block"
          style={{
            color: hovered ? "#c084fc" : "#a855f7",
            letterSpacing: hovered ? "0.05em" : "-0.02em",
          }}
        >
          Scratch
        </span>

        {/* Underline sweep */}
        <span
          className="absolute -bottom-1 left-0 h-0.5 rounded-full bg-gradient-to-r from-purple-700 to-purple-400 transition-all duration-300"
          style={{ width: hovered ? "100%" : "0%" }}
        />
      </span>
    </a>
  );
}