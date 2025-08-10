const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const util = require("util");

const execAsync = util.promisify(exec);

// Icon sizes required for PWA
const iconSizes = [
  { size: 72, name: "icon-72x72.png" },
  { size: 96, name: "icon-96x96.png" },
  { size: 128, name: "icon-128x128.png" },
  { size: 144, name: "icon-144x144.png" },
  { size: 152, name: "icon-152x152.png" },
  { size: 192, name: "icon-192x192.png" },
  { size: 384, name: "icon-384x384.png" },
  { size: 512, name: "icon-512x512.png" },
];

// Additional Apple and Windows specific icons
const additionalIcons = [
  { size: 57, name: "apple-touch-icon-57x57.png" },
  { size: 60, name: "apple-touch-icon-60x60.png" },
  { size: 72, name: "apple-touch-icon-72x72.png" },
  { size: 76, name: "apple-touch-icon-76x76.png" },
  { size: 114, name: "apple-touch-icon-114x114.png" },
  { size: 120, name: "apple-touch-icon-120x120.png" },
  { size: 144, name: "apple-touch-icon-144x144.png" },
  { size: 152, name: "apple-touch-icon-152x152.png" },
  { size: 180, name: "apple-touch-icon-180x180.png" },
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 48, name: "favicon-48x48.png" },
];

const allIcons = [...iconSizes, ...additionalIcons];

async function checkSharpAvailability() {
  try {
    require("sharp");
    return true;
  } catch (error) {
    console.log("Sharp not available, checking for ImageMagick...");
    try {
      await execAsync("magick -version");
      return "imagemagick";
    } catch (imageMagickError) {
      console.log("ImageMagick not available...");
      return false;
    }
  }
}

async function generateIconsWithSharp() {
  console.log("🎨 Generating icons using Sharp (recommended)...");
  const sharp = require("sharp");

  const svgPath = path.join(process.cwd(), "public", "icons", "icon.svg");
  const iconsDir = path.join(process.cwd(), "public", "icons");

  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const svgBuffer = fs.readFileSync(svgPath);

  for (const icon of allIcons) {
    try {
      await sharp(svgBuffer)
        .resize(icon.size, icon.size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(path.join(iconsDir, icon.name));

      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.name}:`, error.message);
    }
  }
}

async function generateIconsWithImageMagick() {
  console.log("🎨 Generating icons using ImageMagick...");

  const svgPath = path.join(process.cwd(), "public", "icons", "icon.svg");
  const iconsDir = path.join(process.cwd(), "public", "icons");

  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  for (const icon of allIcons) {
    try {
      const outputPath = path.join(iconsDir, icon.name);
      await execAsync(
        `magick "${svgPath}" -resize ${icon.size}x${icon.size} "${outputPath}"`
      );
      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.name}:`, error.message);
    }
  }
}

async function generatePWAIcons() {
  console.log("🚀 Starting PWA icon generation...");
  console.log("");

  const svgPath = path.join(process.cwd(), "public", "icons", "icon.svg");

  // Check if SVG exists
  if (!fs.existsSync(svgPath)) {
    console.error(`❌ SVG icon not found at: ${svgPath}`);
    process.exit(1);
  }

  console.log(`📄 Source SVG: ${svgPath}`);

  const method = await checkSharpAvailability();

  try {
    if (method === true) {
      await generateIconsWithSharp();
    } else if (method === "imagemagick") {
      await generateIconsWithImageMagick();
    } else {
      console.error("❌ No image processing tools available.");
      console.log("");
      console.log("💡 To fix this, install Sharp:");
      console.log("   npm install sharp");
      process.exit(1);
    }

    console.log("");
    console.log("🎉 All PWA icons generated successfully!");
    console.log(`📁 Icons saved to: public/icons/`);
    console.log("");
    console.log("📋 Generated icon sizes for PWA:");
    iconSizes.forEach((icon) => {
      console.log(`   - ${icon.name} (${icon.size}x${icon.size}px)`);
    });
    console.log("");
    console.log("🍎 Generated Apple Touch icons:");
    additionalIcons
      .filter((icon) => icon.name.includes("apple"))
      .forEach((icon) => {
        console.log(`   - ${icon.name} (${icon.size}x${icon.size}px)`);
      });
    console.log("");
    console.log("🌐 Generated Favicon icons:");
    additionalIcons
      .filter((icon) => icon.name.includes("favicon"))
      .forEach((icon) => {
        console.log(`   - ${icon.name} (${icon.size}x${icon.size}px)`);
      });
  } catch (error) {
    console.error("❌ Icon generation failed:", error.message);
    console.log("");
    console.log("💡 Try installing Sharp:");
    console.log("   npm install sharp");
    process.exit(1);
  }
}

if (require.main === module) {
  generatePWAIcons();
}

module.exports = { generatePWAIcons };
