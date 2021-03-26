import React from "react";
import PatientTreatmentPlan from "../../../doctors/PatientTreatmentPlan";
import { textForKey } from "../../../../utils/localization";
import { Typography } from "@material-ui/core";
import styles from '../../../../styles/PatientTreatmentPlanContainer.module.scss';

const PatientTreatmentPlanContainer = ({ currentUser, currentClinic, patientId }) => {
  return (
    <div className={styles.patientTreatmentPlanContainer}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Treatment plan')}
      </Typography>
      <div className={styles.planWrapper}>
        <PatientTreatmentPlan
          readOnly
          servicesClasses={styles.selectedServices}
          currentUser={currentUser}
          currentClinic={currentClinic}
          patientId={patientId}
        />
      </div>
    </div>
  )
}

export default PatientTreatmentPlanContainer;
