import React from "react";
import type { ReactNode } from "react";
import { ThemeProvider } from "@nivo/theming";

// Simple theme object to satisfy Nivo's requirements
const basicTheme = {
  background: "transparent",
  text: {
    fontSize: 11,
    fill: "#333333",
  },
  axis: {
    domain: {
      line: {
        stroke: "#777777",
        strokeWidth: 1,
      },
    },
    ticks: {
      line: {
        stroke: "#777777",
        strokeWidth: 1,
      },
      text: {
        fontSize: 11,
        fill: "#333333",
      },
    },
    legend: {
      text: {
        fontSize: 12,
        fill: "#333333",
      },
    },
  },
  grid: {
    line: {
      stroke: "#dddddd",
      strokeWidth: 1,
    },
  },
  legends: {
    text: {
      fontSize: 11,
      fill: "#333333",
    },
  },
  tooltip: {
    container: {
      background: "#ffffff",
      fontSize: 12,
      borderRadius: 4,
      boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
    },
  },
};

interface ChartThemeProviderProps {
  children: ReactNode;
}

export const ChartThemeProvider: React.FC<ChartThemeProviderProps> = ({
  children,
}) => {
  return <ThemeProvider theme={basicTheme}>{children}</ThemeProvider>;
};
