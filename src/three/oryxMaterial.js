import * as THREE from 'three'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uForm;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uVelocity;

  attribute vec3 aScatter;
  attribute vec4 aSeed;   // x: phase, y: speed, z: size, w: colorMix

  varying float vColorMix;
  varying float vAlpha;

  void main() {
    float f = smoothstep(0.0, 1.0, uForm);
    vec3 pos = mix(aScatter, position, f);

    // gentle, seeded drift — calm
    float ph = aSeed.x * 6.2831;
    float sp = aSeed.y;
    float energy = 0.015 + uVelocity * 0.2;
    pos.x += sin(uTime * sp + ph) * energy;
    pos.y += cos(uTime * sp * 0.9 + ph * 1.3) * energy;
    pos.z += sin(uTime * sp * 0.7 + ph * 0.7) * energy * 0.8;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.45 + aSeed.z);
    gl_PointSize = clamp(size * uPixelRatio / -mv.z, 1.0, 10.0);

    vColorMix = aSeed.w;
    vAlpha = mix(0.32, 1.0, f) * clamp(1.0 - (-mv.z - 3.0) / 8.0, 0.14, 1.0);
  }
`

const fragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uTint;
  uniform float uTintAmount;

  varying float vColorMix;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.05, d);

    vec3 col = mix(uColorA, uColorB, vColorMix);
    col = mix(col, uTint, uTintAmount);
    col += (1.0 - d) * 0.05;

    gl_FragColor = vec4(col, soft * vAlpha);
  }
`

export function createOryxMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uForm: { value: 0.3 },
      uSize: { value: 22 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uVelocity: { value: 0 },
      uColorA: { value: new THREE.Color('#b48a50') },
      uColorB: { value: new THREE.Color('#c9a66b') },
      uTint: { value: new THREE.Color('#b48a50') },
      uTintAmount: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  })
}
