import { useState } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '@mui/icons-material/Close';
import { LevaButton } from '../LevaButton/LevaButton';
import { type useLevaControls } from '../../Controls';
import styles from './HelpGuide.module.scss';

interface HelpGuideProps {
  lang: ReturnType<typeof useLevaControls>['lang'];
}

type Step = {
  titleKey: string;
  descKey: string;
};

const STEPS: Step[] = [
  { titleKey: 'help.step1Title', descKey: 'help.step1Desc' },
  { titleKey: 'help.step2Title', descKey: 'help.step2Desc' },
  { titleKey: 'help.step3Title', descKey: 'help.step3Desc' },
  { titleKey: 'help.step4Title', descKey: 'help.step4Desc' },
  { titleKey: 'help.step5Title', descKey: 'help.step5Desc' },
];

export const HelpGuide = ({ lang }: HelpGuideProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={styles.helpButton}
        onClick={() => setOpen(true)}
        title={lang['help.title'] as string}
        aria-label={lang['help.title'] as string}
      >
        {lang['help.button'] as string}
      </button>

      {open && createPortal(
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>{lang['help.title'] as string}</span>
              <button
                className={styles.closeBtn}
                onClick={() => setOpen(false)}
                title="Close"
                aria-label="Close"
              >
                <CloseIcon style={{ fontSize: '16px' }} />
              </button>
            </div>

            <ul className={styles.stepList}>
              {STEPS.map(({ titleKey, descKey }) => (
                <li key={titleKey} className={styles.step}>
                  <div className={styles.stepTitle}>{lang[titleKey as keyof typeof lang] as string}</div>
                  <div className={styles.stepDesc}>{lang[descKey as keyof typeof lang] as string}</div>
                </li>
              ))}
            </ul>

            <div className={styles.footer}>
              <LevaButton onClick={() => setOpen(false)} intent="primary">
                {lang['help.close'] as string}
              </LevaButton>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};
