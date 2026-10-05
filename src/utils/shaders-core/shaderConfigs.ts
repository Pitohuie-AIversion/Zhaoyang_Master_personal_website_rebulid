import { particleVertexShader, particleFragmentShader } from './particleShaders';
import {
  postProcessVertexShader,
  blurFragmentShader,
  bloomFragmentShader,
  colorCorrectionFragmentShader,
  finalCompositeFragmentShader,
} from './postProcessShaders';

/**
 * 着色器程序配置
 */
export interface ShaderConfig {
  name: string;
  vertexShader: string;
  fragmentShader: string;
}

/**
 * 所有着色器程序配置
 */
export const shaderConfigs: ShaderConfig[] = [
  {
    name: 'particle',
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
  },
  {
    name: 'blur',
    vertexShader: postProcessVertexShader,
    fragmentShader: blurFragmentShader,
  },
  {
    name: 'bloom',
    vertexShader: postProcessVertexShader,
    fragmentShader: bloomFragmentShader,
  },
  {
    name: 'colorCorrection',
    vertexShader: postProcessVertexShader,
    fragmentShader: colorCorrectionFragmentShader,
  },
  {
    name: 'finalComposite',
    vertexShader: postProcessVertexShader,
    fragmentShader: finalCompositeFragmentShader,
  },
];
