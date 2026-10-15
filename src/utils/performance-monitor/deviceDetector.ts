import { DeviceCapabilities, PerformancePreset, performancePresets } from './types';

export const detectDeviceCapabilities = (gl: WebGL2RenderingContext): DeviceCapabilities => {
  return {
    webgl2Supported: true,
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
    maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
    maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
    maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
    maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
    extensions: gl.getSupportedExtensions() || [],
    vendor: gl.getParameter(gl.VENDOR) || 'Unknown',
    renderer: gl.getParameter(gl.RENDERER) || 'Unknown',
    version: gl.getParameter(gl.VERSION) || 'Unknown',
    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || 'Unknown'
  };
};

export const getRecommendedPreset = (
  deviceCapabilities: DeviceCapabilities | null
): PerformancePreset => {
  if (!deviceCapabilities) {
    return performancePresets.medium;
  }

  const { renderer, maxTextureSize } = deviceCapabilities;
  const rendererLower = renderer.toLowerCase();

  // 检测移动设备
  const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);

  // 检测集成显卡
  const isIntegratedGPU = /intel|integrated|uhd|iris/i.test(rendererLower);

  // 检测高端显卡
  const isHighEndGPU = /rtx|gtx|radeon rx|vega|rdna/i.test(rendererLower);

  if (isMobile || maxTextureSize < 4096) {
    return performancePresets.low;
  } else if (isIntegratedGPU || maxTextureSize < 8192) {
    return performancePresets.medium;
  } else if (isHighEndGPU && maxTextureSize >= 16384) {
    return performancePresets.ultra;
  } else {
    return performancePresets.high;
  }
};
