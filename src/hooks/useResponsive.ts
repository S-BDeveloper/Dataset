import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768; // Corresponds to Tailwind's `md` breakpoint

/**
 * A custom hook to detect if the screen is mobile-sized.
 * @returns {boolean} `true` if the screen width is less than the mobile breakpoint.
 */
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};
