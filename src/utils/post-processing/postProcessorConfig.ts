export interface PostProcessConfig {
  blurAmount: number;
  bloomIntensity: number;
  bloomEnabled: boolean;
  contrast: number;
  saturation: number;
  colorTemperature: number;
  noiseIntensity: number;
  noiseAmount: number;
  vignetteStrength: number;
}

export const defaultPostProcessConfig: PostProcessConfig = {
  blurAmount: 1.0,
  bloomIntensity: 0.8,
  bloomEnabled: true,
  contrast: 1.1,
  saturation: 1.2,
  colorTemperature: 6500,
  noiseIntensity: 0.02,
  noiseAmount: 0.01,
  vignetteStrength: 0.3,
};
