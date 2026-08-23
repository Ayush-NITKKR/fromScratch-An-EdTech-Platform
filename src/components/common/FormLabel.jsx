// components/FormLabel.jsx
import React from "react";
import RequiredAsterisk from "./RequiredAsterisk";

const FormLabel = ({ htmlFor, children, required = false }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="text-gray-300 text-sm font-medium mb-1 block"
    >
      {children}
      {required && <RequiredAsterisk />}
    </label>
  );
};

export default FormLabel;