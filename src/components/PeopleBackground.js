"use client";

import React from "react";

const HumanIcon = ({ style }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const TicketIcon = ({ style }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M15 5v2"></path>
    <path d="M15 11v2"></path>
    <path d="M15 17v2"></path>
    <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"></path>
  </svg>
);

const IconBackground = () => {
  const icons = [
    { top: "10%", left: "25%", rotate: "-15deg", type: "ticket" },
    { top: "20%", left: "70%", rotate: "10deg", type: "ticket" },
    { top: "50%", left: "20%", rotate: "5deg", type: "human" },
    { top: "70%", left: "75%", rotate: "-10deg", type: "human" },
    { top: "85%", left: "40%", rotate: "20deg", type: "ticket" },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon, index) =>
        React.createElement(icon.type === "human" ? HumanIcon : TicketIcon, {
          key: index,
          style: {
            position: "absolute",
            top: icon.top,
            left: icon.left,
            transform: `rotate(${icon.rotate})`,
            opacity: 0.2,
          },
        }),
      )}
    </div>
  );
};

export default IconBackground;
