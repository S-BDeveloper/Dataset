import "@testing-library/jest-dom";

// Comprehensive fix for React DOM WebkitAnimation issues
const mockStyle = {
  webkitAnimation: "",
  webkitTransition: "",
  animation: "",
  transition: "",
  getPropertyValue: (prop: string) => {
    if (prop.includes("webkit")) return "";
    if (prop === "animation" || prop === "transition") return "none";
    return "";
  },
};

// Mock HTMLElement style
Object.defineProperty(HTMLElement.prototype, "style", {
  get() {
    return mockStyle;
  },
  configurable: true,
});

// Mock window.getComputedStyle
Object.defineProperty(window, "getComputedStyle", {
  value: () => mockStyle,
  writable: true,
});

// Mock CSS.supports
Object.defineProperty(window, "CSS", {
  value: {
    supports: () => true,
  },
  writable: true,
});

// Mock fetch globally
Object.defineProperty(window, "fetch", {
  value: () => Promise.resolve({ ok: true, text: () => Promise.resolve("") }),
  writable: true,
});

// Mock TextEncoder and TextDecoder
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

// Mock window.URL
Object.defineProperty(window, "URL", {
  value: {
    createObjectURL: () => "mock-url",
    revokeObjectURL: () => {},
  },
  writable: true,
});

// Mock document.createElement
Object.defineProperty(document, "createElement", {
  value: () => ({
    href: "",
    download: "",
    click: () => {},
  }),
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

// Mock CSSStyleDeclaration
Object.defineProperty(window, "CSSStyleDeclaration", {
  value: class CSSStyleDeclaration {
    webkitAnimation = "";
    webkitTransition = "";
    animation = "";
    transition = "";
    getPropertyValue(prop: string) {
      if (prop.includes("webkit")) return "";
      if (prop === "animation" || prop === "transition") return "none";
      return "";
    }
  },
  writable: true,
});

// Mock dataCache for useQuranData
Object.defineProperty(window, "dataCache", {
  value: new Map(),
  writable: true,
});

// Mock Firebase auth
Object.defineProperty(window, "firebase", {
  value: {
    auth: () => ({
      signInWithEmailAndPassword: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChanged: jest.fn(),
    }),
  },
  writable: true,
});
