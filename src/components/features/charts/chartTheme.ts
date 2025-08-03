export const getChartTheme = (isDarkMode: boolean) => ({
  axis: {
    ticks: {
      text: {
        fill: isDarkMode ? "#f0f0f0" : "#333333",
      },
    },
    legend: {
      text: {
        fill: isDarkMode ? "#f0f0f0" : "#333333",
      },
    },
  },
  legends: {
    text: {
      fill: isDarkMode ? "#f0f0f0" : "#333333",
    },
  },
  tooltip: {
    container: {
      background: isDarkMode ? "#333333" : "#ffffff",
      color: isDarkMode ? "#f0f0f0" : "#333333",
    },
  },
});
