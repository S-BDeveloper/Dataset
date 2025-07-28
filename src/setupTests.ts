import "@testing-library/jest-dom";

// Mock fetch globally
Object.defineProperty(window, "fetch", {
  value: () => Promise.resolve({ ok: true, text: () => Promise.resolve("") }),
  writable: true,
});

// Mock TextEncoder and TextDecoder for browser environment
Object.defineProperty(window, "TextEncoder", {
  value: class TextEncoder {
    encode(text: string) {
      return new Uint8Array(text.split("").map((char) => char.charCodeAt(0)));
    }
  },
  writable: true,
});

Object.defineProperty(window, "TextDecoder", {
  value: class TextDecoder {
    decode(bytes: Uint8Array) {
      return String.fromCharCode(...bytes);
    }
  },
  writable: true,
});

// Mock window.URL for file downloads
Object.defineProperty(window, "URL", {
  value: {
    createObjectURL: () => "mock-url",
    revokeObjectURL: () => {},
  },
  writable: true,
});

// Mock document.createElement for download functionality
Object.defineProperty(document, "createElement", {
  value: () => ({
    href: "",
    download: "",
    click: () => {},
  }),
  writable: true,
});

// Mock CSS properties that might be missing in jsdom
Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: () => "",
  }),
  writable: true,
});

// Mock CSS.supports
Object.defineProperty(window, "CSS", {
  value: {
    supports: () => true,
  },
  writable: true,
});

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  value: () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  }),
  writable: true,
});

// Mock ResizeObserver
Object.defineProperty(window, "ResizeObserver", {
  value: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
  writable: true,
});

// Mock IntersectionObserver
Object.defineProperty(window, "IntersectionObserver", {
  value: class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  },
  writable: true,
});

// Mock CSS properties that React DOM uses
Object.defineProperty(window, "getComputedStyle", {
  value: (_element: Element) => ({
    getPropertyValue: (prop: string) => {
      // Mock specific CSS properties that React DOM checks
      if (prop === "animation" || prop === "transition") {
        return "none";
      }
      if (prop.includes("webkit")) {
        return "";
      }
      return "";
    },
  }),
  writable: true,
});

// Mock HTMLElement.prototype.style to prevent WebkitAnimation issues
const originalStyle = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "style"
);
if (originalStyle) {
  Object.defineProperty(HTMLElement.prototype, "style", {
    ...originalStyle,
    get() {
      const style = originalStyle.get?.call(this);
      if (style) {
        // Mock webkit properties
        Object.defineProperty(style, "webkitAnimation", {
          value: "",
          writable: true,
        });
        Object.defineProperty(style, "webkitTransition", {
          value: "",
          writable: true,
        });
      }
      return style;
    },
  });
}
