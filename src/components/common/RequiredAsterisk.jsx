// components/RequiredAsterisk.jsx
import React from "react";

const RequiredAsterisk = ({ className = "" }) => {
  return (
    <span
      className={`text-[#e34c2d] ml-1 select-none ${className}`}
      aria-hidden="true"
    >
      *
    </span>
  );
};

export default RequiredAsterisk;