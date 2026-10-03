import React from 'react';
import { ParticleFieldConfig } from '../../../utils/configManager';
import {
  BloomControls,
  ColorCorrectionControls,
  PostEffectsControls,
} from './postprocess-tab';

export interface PostprocessTabProps {
  config: ParticleFieldConfig;
  updatePostProcessConfig: (updates: Partial<ParticleFieldConfig['postProcess']>) => void;
}

export const PostprocessTab: React.FC<PostprocessTabProps> = ({
  config,
  updatePostProcessConfig,
}) => {
  return (
    <div className="space-y-6">
      <BloomControls
        postProcess={config.postProcess}
        onUpdate={updatePostProcessConfig}
      />
      <ColorCorrectionControls
        postProcess={config.postProcess}
        onUpdate={updatePostProcessConfig}
      />
      <PostEffectsControls
        postProcess={config.postProcess}
        onUpdate={updatePostProcessConfig}
      />
    </div>
  );
};

export default PostprocessTab;
