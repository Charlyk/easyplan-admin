import React from 'react';
import { textForKey } from 'app/utils/localization';
import FacebookIntegration from './FacebookIntegration';
import styles from './Integrations.module.scss';

const Integrations = ({ currentClinic }) => {
  return (
    <div className={styles.integrations}>
      <span className={styles.formTitle}>{textForKey('Integrations')}</span>
      <div className={styles.dataContainer}>
        <FacebookIntegration currentClinic={currentClinic} />
      </div>
    </div>
  );
};

export default Integrations;
