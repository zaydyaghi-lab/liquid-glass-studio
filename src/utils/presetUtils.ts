import { type useLevaControls } from '../Controls';
export interface PresetData {
  version: string;
  timestamp: string;
  controls: ReturnType<typeof useLevaControls>['controls'];
}

export function exportPreset(
  controls: ReturnType<typeof useLevaControls>['controls'],
  filename: string = 'liquid-glass-preset.json',
): void {
  const preset: PresetData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    controls: structuredClone(controls),
  };

  const jsonStr = JSON.stringify(preset, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function copyPresetToClipboard(
  controls: ReturnType<typeof useLevaControls>['controls'],
): Promise<void> {
  const preset: PresetData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    controls: structuredClone(controls),
  };
  const jsonStr = JSON.stringify(preset, null, 2);
  await navigator.clipboard.writeText(jsonStr);
}

export function generateCSSCode(
  controls: ReturnType<typeof useLevaControls>['controls'],
): string {
  const r = Math.round(controls.tint.r);
  const g = Math.round(controls.tint.g);
  const b = Math.round(controls.tint.b);
  const a = controls.tint.a.toFixed(2);

  const blurValue = Math.round(controls.blurRadius);

  const borderRadius = Math.round(
    (Math.min(controls.shapeWidth, controls.shapeHeight) / 2) * (controls.shapeRadius / 100),
  );

  // In WebGL y-axis is up; CSS y-axis is down, so invert Y offset
  const shadowX = Math.round(controls.shadowPosition.x);
  const shadowY = Math.round(-controls.shadowPosition.y);
  const shadowBlur = Math.round(controls.shadowExpand);
  const shadowAlpha = (controls.shadowFactor / 100).toFixed(2);

  return `/* Replace .liquid-glass with your own class name */
.liquid-glass {
  width: ${Math.round(controls.shapeWidth)}px;
  height: ${Math.round(controls.shapeHeight)}px;
  border-radius: ${borderRadius}px;
  background: rgba(${r}, ${g}, ${b}, ${a});
  backdrop-filter: blur(${blurValue}px);
  -webkit-backdrop-filter: blur(${blurValue}px);
  box-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha});
  /* Note: refraction, dispersion & glare require WebGL */
}`;
}

export function importPreset(file: File): Promise<PresetData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const preset = JSON.parse(content) as PresetData;

        if (!preset.version || !preset.controls) {
          reject(new Error('Invalid preset file format'));
          return;
        }

        resolve(preset);
      } catch (err) {
        reject(new Error(`Failed to parse preset file: ${err}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}
