import { useRef, useState } from 'react';
import { LevaButton } from '../LevaButton/LevaButton';
import { exportPreset, importPreset, generateCSSForFigma } from '../../utils/presetUtils';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CloseIcon from '@mui/icons-material/Close';
import styles from './PresetControls.module.scss';
import { type useLevaControls } from '../../Controls';

export interface PresetControlsProps {
  controls: ReturnType<typeof useLevaControls>['controls'];
  controlsAPI: ReturnType<typeof useLevaControls>['controlsAPI'];
  lang: ReturnType<typeof useLevaControls>['lang'];
}

export const PresetControls = ({ controls, controlsAPI, lang }: PresetControlsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cssModalOpen, setCssModalOpen] = useState(false);
  const [cssCode, setCssCode] = useState('');
  const [copied, setCopied] = useState(false);

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

  const handleCopyCSS = () => {
    const css = generateCSSForFigma(controls);
    setCssCode(css);
    setCssModalOpen(true);
    setCopied(false);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cssCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — show a message to manually copy the text
      setCopied(false);
    }
  };

  const handleCloseModal = () => {
    setCssModalOpen(false);
  };

  return (
    <>
      <div className={styles.presetControls}>
        <LevaButton onClick={handleExport} title="Export current preset">
          <FileDownloadOutlinedIcon style={{ fontSize: '14px', marginRight: '4px' }} />
          {lang['editor.export'] || 'Export'}
        </LevaButton>

        <LevaButton onClick={handleImportClick} title="Import preset from file">
          <FileUploadOutlinedIcon style={{ fontSize: '14px', marginRight: '4px' }} />
          {lang['editor.import'] || 'Import'}
        </LevaButton>

        <LevaButton onClick={handleCopyCSS} title={lang['editor.copyCSSTitle'] || 'Copy CSS for Figma'}>
          <ContentCopyOutlinedIcon style={{ fontSize: '14px', marginRight: '4px' }} />
          {lang['editor.copyCSS'] || 'Copy CSS'}
        </LevaButton>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {cssModalOpen && (
        <div className={styles.cssModalOverlay} onClick={handleCloseModal}>
          <div className={styles.cssModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.cssModalHeader}>
              <span className={styles.cssModalTitle}>
                {lang['editor.copyCSSModalTitle'] || 'Figma CSS'}
              </span>
              <button className={styles.cssModalCloseBtn} onClick={handleCloseModal} title="Close">
                <CloseIcon style={{ fontSize: '16px' }} />
              </button>
            </div>
            <p className={styles.cssModalDesc}>
              {lang['editor.copyCSSModalDesc'] || 'Copy the CSS below into Figma via a CSS plugin or use it as a reference.'}
            </p>
            <textarea
              className={styles.cssTextarea}
              readOnly
              value={cssCode}
              spellCheck={false}
            />
            <div className={styles.cssModalFooter}>
              <LevaButton onClick={handleCopyToClipboard} intent={copied ? 'primary' : 'normal'}>
                <ContentCopyOutlinedIcon style={{ fontSize: '14px', marginRight: '4px' }} />
                {copied
                  ? (lang['editor.copyCSSSuccess'] || 'Copied!')
                  : (lang['editor.copyCSSModalCopy'] || 'Copy')}
              </LevaButton>
              <LevaButton onClick={handleCloseModal}>
                {lang['editor.copyCSSModalClose'] || 'Close'}
              </LevaButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
