import { useMemo, useRef, useState } from 'react';
import { LevaButton } from '../LevaButton/LevaButton';
import { copyPresetToClipboard, exportPreset, importPreset } from '../../utils/presetUtils';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import styles from './PresetControls.module.scss';
import { type useLevaControls } from '../../Controls';

export interface PresetControlsProps {
  controls: ReturnType<typeof useLevaControls>['controls'];
  controlsAPI: ReturnType<typeof useLevaControls>['controlsAPI'];
  lang: ReturnType<typeof useLevaControls>['lang'];
}

export const PresetControls = ({ controls, controlsAPI, lang }: PresetControlsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const presetJson = useMemo(() => {
    if (!showCode) return '';
    return JSON.stringify({ version: '1.0.0', controls }, null, 2);
  }, [showCode, controls]);

  const handleCopy = async () => {
    try {
      await copyPresetToClipboard(controls);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(lang['editor.copyFailedMessage']);
    }
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    exportPreset(controls, `liquid-glass-${timestamp}.json`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const preset = await importPreset(file);
      console.log('Preset loaded:', preset);

      if (typeof controlsAPI === 'function') {
        try {
          controlsAPI(preset.controls);
        } catch (err) {
          console.error(`Error setting preset values with leva:`, err);
        }
      } else {
        console.error('controlsAPI is not a function. Import may fail.', controlsAPI);
      }
      alert(lang['editor.importSuccessMessage']);
    } catch (err) {
      alert(lang['editor.importFailedMessage'](err instanceof Error ? err.message : 'Unknown error'));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.presetControls}>
      <div className={styles.buttons}>
        <LevaButton onClick={handleCopy} title="Copy current preset to clipboard">
          <ContentCopyOutlinedIcon style={{ fontSize: '14px', marginRight: '4px' }} />
          {copied ? lang['editor.copySuccessMessage'] : lang['editor.copy']}
        </LevaButton>

        <LevaButton onClick={handleExport} title="Export current preset">
          <FileDownloadOutlinedIcon style={{ fontSize: '14px', marginRight: '4px' }} />
          {lang['editor.export'] || 'Export'}
        </LevaButton>

        <LevaButton onClick={handleImportClick} title="Import preset from file">
          <FileUploadOutlinedIcon style={{ fontSize: '14px', marginRight: '4px' }} />
          {lang['editor.import'] || 'Import'}
        </LevaButton>

        <LevaButton onClick={() => setShowCode((v) => !v)} active={showCode} title="Show preset as code">
          <CodeOutlinedIcon style={{ fontSize: '14px', marginRight: '4px' }} />
          {lang['editor.showCode']}
        </LevaButton>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {showCode && (
        <textarea
          className={styles.codePanel}
          readOnly
          value={presetJson}
          onFocus={(e) => e.currentTarget.select()}
          onClick={(e) => e.currentTarget.select()}
          spellCheck={false}
        />
      )}
    </div>
  );
};
