const fs = require("fs");
const path = require("path");

async function generateFavicon() {
  console.log("🎨 Generating favicon.ico from PNG...");

  try {
    const sharp = require("sharp");

    const iconPath = path.join(
      process.cwd(),
      "public",
      "icons",
      "icon-32x32.png"
    );
    const faviconPath = path.join(
      process.cwd(),
      "public",
      "icons",
      "favicon.ico"
    );

    // Check if 32x32 PNG exists
    if (!fs.existsSync(iconPath)) {
      console.error("❌ icon-32x32.png not found");
      return;
    }

    // Generate favicon.ico from 32x32 PNG
    await sharp(iconPath)
      .resize(32, 32)
      .png()
      .toFile(faviconPath.replace(".ico", ".png"));

    // Copy as .ico (browsers accept PNG with .ico extension)
    fs.copyFileSync(iconPath, faviconPath);

    console.log("✅ Generated favicon.ico");
  } catch (error) {
    console.error("❌ Failed to generate favicon:", error.message);

    // Fallback: just copy the 32x32 PNG as ico
    try {
      const iconPath = path.join(
        process.cwd(),
        "public",
        "icons",
        "favicon-32x32.png"
      );
      const faviconPath = path.join(
        process.cwd(),
        "public",
        "icons",
        "favicon.ico"
      );

      if (fs.existsSync(iconPath)) {
        fs.copyFileSync(iconPath, faviconPath);
        console.log("✅ Generated favicon.ico (fallback method)");
      }
    } catch (fallbackError) {
      console.error(
        "❌ Fallback favicon generation failed:",
        fallbackError.message
      );
    }
  }
}

if (require.main === module) {
  generateFavicon();
}

module.exports = { generateFavicon };
