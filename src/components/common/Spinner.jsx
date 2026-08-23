import React from "react";

const BurningSpinner = ({ size = 32 }) => {
  return (
    <>
      <style>
        {`
          @keyframes flicker {
            0%   { transform: scale(1) rotate(-2deg); }
            20%  { transform: scale(1.08) rotate(2deg); }
            40%  { transform: scale(0.95) rotate(-3deg); }
            60%  { transform: scale(1.1) rotate(1deg); }
            80%  { transform: scale(0.97) rotate(3deg); }
            100% { transform: scale(1) rotate(-2deg); }
          }
          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 6px 2px rgba(255, 140, 0, 0.35),
                          0 0 12px 4px rgba(255, 60, 0, 0.15);
            }
            50% {
              box-shadow: 0 0 14px 6px rgba(255, 170, 0, 0.55),
                          0 0 24px 10px rgba(255, 60, 0, 0.3);
            }
          }
          .burning-wrapper {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            animation: glow 0.6s ease-in-out infinite;
          }
          .burning-emoji {
            display: inline-block;
            animation: flicker 0.45s ease-in-out infinite;
            filter: drop-shadow(0 0 4px rgba(255, 100, 0, 0.5));
          }
        `}
      </style>
      <span className="burning-wrapper" style={{ padding: size * 0.25 }}>
        <span
          className="burning-emoji"
          style={{ fontSize: size, lineHeight: 1 }}
          role="status"
          aria-label="Loading"
        >
          🔥
        </span>
      </span>
    </>
  );
};

export default BurningSpinner;