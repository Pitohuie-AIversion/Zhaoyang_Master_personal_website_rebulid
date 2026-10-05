import { type RenderConfig, defaultRenderConfig } from '../postProcessingPipeline';

export type { RenderConfig };
export { defaultRenderConfig };

export interface ParticleUniforms {
  projectionMatrix: Float32Array;
  viewMatrix: Float32Array;
  time: number;
  width: number;
  height: number;
  pointSize?: number;
  opacity?: number;
}
