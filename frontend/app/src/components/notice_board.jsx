import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import React, { useRef } from 'react';
import '../index.css';

export default function Notice({ pathData, text }) {
  gsap.registerPlugin(useGSAP);
  gsap.registerPlugin(MotionPathPlugin);

  const notice = useRef(null);
  const uniqueId = `path-${Math.random().toString(36).substring(2, 9)}`;

  const handleClick = () => {
    alert("Clicked!");
  };

  useGSAP(() => {
    gsap.to(notice.current, {
      motionPath: {
        path: `#${uniqueId}`,
        align: `#${uniqueId}`,
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
      },
      duration: 6,
      repeat: -1,
      ease: "none",
      yoyo: true,
    });
  });

  return (
    <div className="w-full max-w-lg mx-auto overflow-visible px-2 flex justify-center items-center">
      <svg
        className="w-full h-auto"
        viewBox="0 0 700 700"
        preserveAspectRatio="xMidYMid meet"
        style={{ minWidth: "400px", minHeight: "400px" }}
      >
        {/* Visualize path for debugging - can be removed later */}
        <path
          id={uniqueId}
          d={pathData}
          stroke="#333333"
          strokeWidth="1"
          strokeDasharray="5,5"
          fill="transparent"
          transform="translate(0, 50)"
        />

        <g ref={notice}>
          {/* Ropes */}
          <circle cx="300" cy="50" r="6" fill="white" />
          <line x1="300" y1="50" x2="253" y2="112" stroke="white" strokeWidth="2" />
          <line x1="300" y1="50" x2="347" y2="112" stroke="white" strokeWidth="2" />

          {/* Hanging Board */}
          <rect
            onClick={handleClick}
            x="250"
            y="110"
            width="100"
            height="80"
            rx="8"
            ry="8"
            fill="#deb887"
            stroke="#654321"
            strokeWidth="2"
            style={{ cursor: "pointer" }}
          />

          {/* Text inside the board */}
          <foreignObject x="255" y="115" width="90" height="70">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              onClick={handleClick}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontSize: "16px",
                wordWrap: "break-word",
                whiteSpace: "normal",
                overflow: "hidden",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              {text}
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  );
}
