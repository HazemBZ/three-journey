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

### Sides

- `material.side = THREE.DoubleSide`;

### Meterials

#### **MeshBasicMaterial**

probably the most "basic" material
applies a uniform color or texture to our geometry

**Map**
The map property will apply a texture on the surface of the geometry:

`material.map = doorColorTexture`

**Color**

The color property will apply a uniform color on the surface of the geometry. When you are changing the color property directly, you must instantiate a Color class. You can use many different formats.

Try commenting on the map first and test those color formats:

```js
// material.map = doorColorTexture
material.color = new THREE.Color("#ff0000");
material.color = new THREE.Color("#f00");
material.color = new THREE.Color("red");
material.color = new THREE.Color("rgb(255, 0, 0)");
material.color = new THREE.Color(0xff0000);
```

\*Combining color and map will tint the texture with the color:

**Wireframe**
The wireframe property will show the triangles that compose your geometry with a thin line of 1px regardless of the distance of the camera:

**Opacity**
The opacity property controls the transparency but, to work, you need to set the transparent property to true in order to inform Three.js that this material now supports transparency.

```js
material.transparent = true;
material.opacity = 0.5;
```

**AlphaMap**
Now that the transparency is working, we can use the alphaMap property to control the transparency with a texture:

```js
material.transparent = true;
// material.opacity = 0.5
material.alphaMap = doorAlphaTextur;
```

**Side**
The side property lets you decide which side of the faces is visible. By default, the front side is visible (THREE.FrontSide), but you can show the backside instead (THREE.BackSide) or both (THREE.DoubleSide):

```js
material.side = THREE.DoubleSide;
```

\* Try to avoid using THREE.DoubleSide whenever possible because it actually requires more resources when rendering, even though the side isn’t visible.

#### MeshNormalMaterial

Displays a nice purple, blueish color that looks represent the default normals of your geometry
The color will just display the normal orientation relative to the camera (If you rotate around the sphere, you'll see that the color is always the same, regardless of which part of the sphere you're looking at)

Normals are information encoded in each vertex that contains the direction of the outside of the face. If you displayed those normals as arrows, you would get straight lines coming out of each vertex that compose your geometry. \* You can use Normals for many things like calculating "how to illuminate" the face or "how the environment should reflect or refract on the geometries' surface".

**flatshading**
Flattens the faces, meaning the normals won't be interpolated between the vertices

#### MeshMatcapMaterial

is a fantastic material because of how great it can look while remaining very performant
needs a reference texture that looks like a sphere.
The material will then pick colors from the texture according to the normal orientation relative to the camera

The meshes will appear illuminated, but it's an illusion created by the texture. There is no light in the scene.

The only problem is that the result is the same regardless of the camera orientation. Also, you cannot update the lights because there are none.

```js
// MeshMatcapMaterial
const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;
```

#### MeshDepthMaterial

will simply color the geometry in white if it's close to the camera's near value and in black if it's close to the far value of the camera

```js
// MeshDepthMaterial
const material = new THREE.MeshDepthMaterial();
```

actually it is used to save the depth in a texture, which can be used for later complex computations like handling shadows

#### MeshLamberMaterial

```js
const material = new THREE.MeshLambertMaterial();
```

\* requires some lights

```js
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);
```

is the most performant material that uses lights. Unfortunately, the parameters aren't convenient, and you can see strange patterns in the geometry if you look closely at rounded geometries like the sphere

#### MeshPhongMaterial

Very similar to the MeshLambertMaterial, but the strange patterns are less visible, and you can also see the light reflection on the surface of the geometry:

```js
// MeshPhongMaterial
const material = new THREE.MeshPhongMaterial();
```

MeshPhongMaterial is less performant than MeshLambertMaterial. However, it doesn't really matter at this level.

ou can control the light reflection with the shininess property. The higher the value, the shinier the surface. You can also change the color of the reflection by using the specular property:

```js
material.shininess = 100;
material.specular = new THREE.Color(0x1188ff);
```

#### MeshToonMaterial

Similar to the MeshLambertMaterial in terms of properties but with a cartoonish style:

```
// MeshToonMaterial
const material = new THREE.MeshToonMaterial()
```

By default, you only get a two-part coloration (one for the shadow and one for the light). To add more steps to the coloration, you can use the gradientTexture we loaded at the start of the lesson on the gradientMap property:

`material.gradientMap = gradientTexture`

### Adding an environment map

Let's start by changing the metalness and the roughness of MeshStandardMaterial so that we can appreciate the upcoming environment map:

```js
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
```

we need to use the RGBELoader. Import RGBELoader from three/examples/jsm/loaders/RGBELoader.js:

```js
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Environment map
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});
```

Although we’ve only added the environment map now, it is also compatible with MeshLambertMaterial and MeshPhongMaterial.

And since the environment map is enough on its own, we are going to remove or comment the AmbientLight and the PointLight:

```js
// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)
```

### MeshStandardMaterial Part2

#### More properties

**map**
The `map` property allows you to apply a simple texture. You can use doorColorTexture:

```js
material.map = doorColorTexture;
```

**ambient occlusion**
The `aoMap` property (literally "ambient occlusion map") will add shadows where the texture is dark.

Then, add the aoMap using the doorAmbientOcclusionTexture texture and control the intensity using the aoMapIntensity property:

material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1

> Note that the aoMap only affects light created by AmbientLight, the environment map, and the HemisphereLight you’ll see in a later lesson.

**displacement**
The `displacementMap` property will move the vertices to create true relief:

```js
material.displacementMap = doorHeightTexture;
```

\* It should look terrible. That is due to the lack of vertices on our geometries and the displacement being way too strong.

Add more subdivisions to the geometries:

```js
new THREE.SphereGeometry(0.5, 64, 64),
  // ...
  new THREE.PlaneGeometry(1, 1, 100, 100),
  // ...
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  (material.displacementScale = 0.1);
```

**metalnessMap and roughnessMap**
Instead of specifying uniform metalness and roughness for the whole geometry, we can use metalnessMap and roughnessMap:

```
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
```

\* The reflection looks weird because the metalness and roughness properties still affect the metalnessMap and roughnessMap. In order to work properly, we need to set both the metalness and roughness to 1:

```js
material.metalness = 1;
material.roughness = 1;
```

**alpha map**
You can control the alpha using the alphaMap property. Don't forget to set the transparent property to true:

```js
material.transparent = true;
material.alphaMap = doorAlphaTexture;
```
