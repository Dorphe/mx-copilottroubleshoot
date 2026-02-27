// This file is generated automatically.

import React from "react";
import type { SvgIconComponent } from "./types";

export const CopilotIcon: SvgIconComponent = ({ size, ...props }) => {
  const id_a = React.useId();
  return (
    <svg
      width={size ?? "24"}
      height={size ?? "24"}
      fill="none"
      stroke="none"
      {...props}
      viewBox="0 0 24 24"
    >
      <path fill={`url(#linear_gradient_${id_a})`} d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0" />
      <path
        fill="#fff"
        d="M12 4s.44 4.12 2.16 5.84S20 12 20 12s-4.12.44-5.84 2.16S12 20 12 20s-.44-4.12-2.16-5.84S4 12 4 12s4.12-.44 5.84-2.16S12 4 12 4"
      />
      <defs>
        <linearGradient
          id={`linear_gradient_${id_a}`}
          x1="3.43"
          x2="26.57"
          y1="12.95"
          y2="12.1"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#246CFF" />
          <stop offset="1" stopColor="#2ED888" />
        </linearGradient>
      </defs>
    </svg>
  );
};
