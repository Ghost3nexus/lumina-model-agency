import type { MotionPreset } from '../../types/video';

export const MOTION_PRESETS: MotionPreset[] = [
  { id: 'walk', label: 'Walk', prompt: 'Walking slowly forward, natural stride, arms swaying gently' },
  { id: 'turn', label: 'Turn', prompt: 'Slowly turning head to look at camera, subtle body rotation' },
  { id: 'pose', label: 'Pose', prompt: 'Striking a confident fashion pose, slight weight shift' },
  { id: 'hair-touch', label: 'Hair Touch', prompt: 'Running fingers through hair, gentle head tilt' },
  { id: 'grwm', label: 'GRWM', prompt: 'Natural getting-ready movement, checking mirror, adjusting outfit' },
  { id: 'candid', label: 'Candid', prompt: 'Candid moment, natural smile, relaxed body language' },
  { id: 'custom', label: 'Custom', prompt: '' },
];

export const DEFAULT_NEGATIVE_PROMPT = 'morphing, distortion, blurry face, extra fingers, unnatural body movement';
