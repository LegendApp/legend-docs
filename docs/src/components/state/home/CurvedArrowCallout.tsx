import React from "react";

const CurvedArrowCallout = ({
  width = 200,
  height = 100,
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 220 100">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="10 0, 0 3.5, 10 7" fill="#3b82f6" />
        </marker>
      </defs>
      <path
        d="M190,50 Q100,0 10,50"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3.5"
        markerStart="url(#arrowhead)"
      />
    </svg>
  );
};

export default CurvedArrowCallout;