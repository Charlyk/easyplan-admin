import React from 'react';
import { textForKey } from 'app/utils/localization';
import FacebookIntegration from './FacebookIntegration';
import styles from './Integrations.module.scss';
import MoizvonkiIntegration from './MoizvonkiIntegration';

const Integrations = ({ currentClinic, facebookToken, facebookCode }) => {
  return (
    <div className={styles.integrations}>
      <span className={styles.formTitle}>{textForKey('Integrations')}</span>
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
