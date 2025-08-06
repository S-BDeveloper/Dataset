# PWA Icon Generation Guide

## Quick Setup for PWA Install Button

To make the PWA install button available, you need to generate PNG icons from the SVG template.

### Option 1: Online Icon Generator (Recommended)

1. Go to https://realfavicongenerator.net/
2. Upload the `public/icons/icon.svg` file
3. Download the generated icons
4. Place them in the `public/icons/` directory

### Option 2: Using ImageMagick (Command Line)

```bash
# Install ImageMagick first, then run:
convert public/icons/icon.svg -resize 72x72 public/icons/icon-72x72.png
convert public/icons/icon.svg -resize 96x96 public/icons/icon-96x96.png
convert public/icons/icon.svg -resize 128x128 public/icons/icon-128x128.png
convert public/icons/icon.svg -resize 144x144 public/icons/icon-144x144.png
convert public/icons/icon.svg -resize 152x152 public/icons/icon-152x152.png
convert public/icons/icon.svg -resize 192x192 public/icons/icon-192x192.png
convert public/icons/icon.svg -resize 384x384 public/icons/icon-384x384.png
convert public/icons/icon.svg -resize 512x512 public/icons/icon-512x512.png
```

### Option 3: Using GIMP or Photoshop

1. Open the SVG file in GIMP/Photoshop
2. Export as PNG at each required size
3. Save with the correct filenames

### Required Icon Files:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### Testing the Install Button:

1. Generate the icons using any method above
2. Place them in `public/icons/` directory
3. Start your development server
4. Open Chrome DevTools → Application → Manifest
5. The install button should now appear in the navbar

### Browser Requirements:

- Chrome/Edge: Requires HTTPS or localhost
- Firefox: May show different install prompt
- Safari: Uses different installation method

The install button will only appear when:

- The app meets PWA criteria
- User hasn't already installed it
- Browser supports PWA installation
