// Copyright Protection Utilities
// This file implements technical measures to protect intellectual property

export class CopyrightProtection {
  private static instance: CopyrightProtection;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): CopyrightProtection {
    if (!CopyrightProtection.instance) {
      CopyrightProtection.instance = new CopyrightProtection();
    }
    return CopyrightProtection.instance;
  }

  // Initialize copyright protection
  public initialize(): void {
    if (this.isInitialized) return;

    this.addCopyrightNotice();
    this.preventDevTools();
    this.addConsoleWarning();
    this.protectSourceCode();
    this.addWatermark();

    this.isInitialized = true;
  }

  // Add copyright notice to console
  private addCopyrightNotice(): void {
    const copyrightText = `
╔══════════════════════════════════════════════════════════════╗
║                    COPYRIGHT NOTICE                          ║
║                                                              ║
║  © 2024 Islamic Dataset Interface. All rights reserved.     ║
║                                                              ║
║  This application is protected by copyright laws and         ║
║  international treaties. Unauthorized reproduction,          ║
║  distribution, or modification is strictly prohibited.       ║
║                                                              ║
║  For licensing inquiries: contact@islamicdata.com           ║
╚══════════════════════════════════════════════════════════════╝
    `;

    console.log(copyrightText);
  }

  // Prevent developer tools access
  private preventDevTools(): void {
    // Detect F12 key
    document.addEventListener("keydown", (e) => {
      if (e.key === "F12") {
        e.preventDefault();
        this.showCopyrightWarning();
      }
    });

    // Detect right-click context menu
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.showCopyrightWarning();
    });

    // Detect Ctrl+Shift+I (DevTools)
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        this.showCopyrightWarning();
      }
    });
  }

  // Add warning to console
  private addConsoleWarning(): void {
    const warning = `
⚠️  COPYRIGHT WARNING ⚠️

This application is protected by copyright laws.
Unauthorized access to source code or reverse engineering
is strictly prohibited and may result in legal action.

For legitimate development purposes, please contact:
contact@islamicdata.com
    `;

    console.warn(warning);
  }

  // Protect source code visibility
  private protectSourceCode(): void {
    // Disable text selection on critical elements
    const criticalElements = document.querySelectorAll(".copyright-protected");
    criticalElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.userSelect = "none";
    });

    // Add protection to images and assets
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.addEventListener("contextmenu", (e) => e.preventDefault());
      img.addEventListener("dragstart", (e) => e.preventDefault());
    });
  }

  // Add invisible watermark
  private addWatermark(): void {
    const watermark = document.createElement("div");
    watermark.innerHTML = "© 2024 Islamic Dataset Interface";
    watermark.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 24px;
      color: rgba(0, 0, 0, 0.02);
      pointer-events: none;
      z-index: -1;
      user-select: none;
      white-space: nowrap;
    `;
    document.body.appendChild(watermark);
  }

  // Show copyright warning
  private showCopyrightWarning(): void {
    const warning = document.createElement("div");
    warning.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1f2937;
        color: white;
        padding: 20px;
        border-radius: 8px;
        border: 2px solid #ef4444;
        z-index: 10000;
        max-width: 400px;
        text-align: center;
        font-family: Arial, sans-serif;
      ">
        <h3 style="color: #ef4444; margin-bottom: 10px;">⚠️ Copyright Warning</h3>
        <p style="margin-bottom: 15px; line-height: 1.5;">
          This application is protected by copyright laws. 
          Unauthorized access or modification is prohibited.
        </p>
        <button onclick="this.parentElement.remove()" style="
          background: #059669;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        ">
          I Understand
        </button>
      </div>
    `;
    document.body.appendChild(warning);
  }

  // Verify application integrity
  public verifyIntegrity(): boolean {
    // In a real implementation, you would check file hashes
    // For now, we'll just return true
    return true;
  }

  // Get copyright information
  public getCopyrightInfo(): object {
    return {
      year: new Date().getFullYear(),
      owner: "Islamic Dataset Interface",
      rights: "All rights reserved",
      contact: "contact@islamicdata.com",
      version: "1.0.0",
      protectionLevel: "High",
    };
  }
}

// Initialize copyright protection when the module is loaded
const copyrightProtection = CopyrightProtection.getInstance();
copyrightProtection.initialize();

export default copyrightProtection;
