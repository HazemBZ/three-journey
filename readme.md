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

- **UV Unwrapping**
  is stretching or squeezed the texture in different ways to cover the geometry correctly
  ach vertex will have a 2D coordinate (UV coordinates) on a flat (usually square) plane.
  If you create your own geometry and want to apply a texture to it, you'll have to specify the UV coordinates

- The general idea is that textures that are used on the map or matcap (that you’ll see later) properties of a material are supposed to be encoded in sRGB and we need to set the colorSpace to THREE.sRGBColorSpace but only for those.

- **Minification filter**
  The minification filter happens when the pixels of texture are smaller than the pixels of the render. In other words, the texture is too big for the surface, it covers.
  options: (
  THREE.NearestFilter
  THREE.LinearFilter
  THREE.NearestMipmapNearestFilter
  THREE.NearestMipmapLinearFilter
  THREE.LinearMipmapNearestFilter
  THREE.LinearMipmapLinearFilter
  )

- **Magnification filter**
  The magnification filter works just like the minification filter, but when the pixels of the texture are bigger than the render's pixels. In other words, the texture too small for the surface it covers.
  options: (
  THREE.NearestFilter
  THREE.LinearFilter
  )

- -\*- One final word about all those filters is that THREE.NearestFilter is cheaper than the other ones, and you should get better performances when using it.
  Only use the mipmaps for the minFilter property. If you are using the THREE.NearestFilter, you don't need the mipmaps, and you can deactivate them with colorTexture.generateMipmaps = false:

- Texture format and optimisation
  When you are preparing your textures, you must keep 3 crucial elements in mind:
  The weight
  The size (or the resolution)
  The data

**Where to find textures**

- poliigon.com
- 3dtextures.me
- arroway-textures.ch

Always make sure that you have the right to use the texture if it's not for personal usage.

You can also create your own using photos and 2D software like Photoshop or even procedural textures with software like Substance Designer.
