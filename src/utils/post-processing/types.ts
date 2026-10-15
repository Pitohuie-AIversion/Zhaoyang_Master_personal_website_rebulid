/**
 * WebGL 后处理渲染管线配置
 */

export interface RenderConfig {
  enableBloom: boolean;
  enableBlur: boolean;
  enableColorCorrection: boolean;
  bloomStrength: number;
  bloomThreshold: number;
  blurAmount: number;
  contrast: number;
  brightness: number;
  saturation: number;
  colorTint: [number, number, number];
  vignette: number;
  filmGrain: number;
}

export const defaultRenderConfig: RenderConfig = {
  enableBloom: true,
  enableBlur: true,
  enableColorCorrection: true,
  bloomStrength: 0.8,
  bloomThreshold: 0.6,
  blurAmount: 1.0,
  contrast: 1.2,
  brightness: 0.0,
  saturation: 1.1,
  colorTint: [1.0, 1.0, 1.0],
  vignette: 0.3,
  filmGrain: 0.1,
};
