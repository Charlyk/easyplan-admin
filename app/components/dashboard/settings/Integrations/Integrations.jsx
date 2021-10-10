import React from "react";
import { textForKey } from "../../../../utils/localization";
import styles from './Integrations.module.scss';
import FacebookIntegration from "./FacebookIntegration";

const Integrations = ({ currentUser, currentClinic }) => {
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