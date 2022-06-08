import React from 'react';
import { useTranslate } from 'react-polyglot';
import FacebookIntegration from './FacebookIntegration';
import styles from './Integrations.module.scss';
import MoizvonkiIntegration from './MoizvonkiIntegration';

const Integrations = ({ currentClinic, facebookToken, facebookCode }) => {
  const textForKey = useTranslate();
  return (
    <div className={styles.integrations}>
      <span className={styles.formTitle}>{textForKey('integrations')}</span>
      <div className={styles.dataContainer}>
        <FacebookIntegration
          facebookCode={facebookCode}
          facebookToken={facebookToken}
          currentClinic={currentClinic}
        />
        <MoizvonkiIntegration />
      </div>
    </div>
  );
};

export default Integrations;
