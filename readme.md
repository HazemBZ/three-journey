# Three.js Journey

## Mark:

https://threejs-journey.com/lessons/textures#pbr

## Setup

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## Notes

- The general idea is that textures that are used on the map or matcap (that you’ll see later) properties of a material are supposed to be encoded in sRGB and we need to set the colorSpace to THREE.sRGBColorSpace but only for those.
-
