import React, { useEffect, useState } from "react";
import PatientTreatmentPlan from "../../../doctors/PatientTreatmentPlan";
import { textForKey } from "../../../../utils/localization";
import { CircularProgress, Typography } from "@material-ui/core";
import styles from '../../../../styles/PatientTreatmentPlanContainer.module.scss';
import { fetchDoctorScheduleDetails } from "../../../../middleware/api/schedules";
import { toast } from "react-toastify";

const PatientTreatmentPlanContainer = ({ currentUser, currentClinic, patientId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    setIsLoading(true);
    try {
      const { data: initialSchedule } = await fetchDoctorScheduleDetails(null, patientId);
      setScheduleData(initialSchedule);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.patientTreatmentPlanContainer}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Treatment plan')}
      </Typography>
      <div className={styles.planWrapper}>
        {isLoading && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar'/>
          </div>
        )}
        {!isLoading && scheduleData != null && (
          <PatientTreatmentPlan
            readOnly
            scheduleData={scheduleData}
            servicesClasses={styles.selectedServices}
            currentUser={currentUser}
            currentClinic={currentClinic}
          />
        )}
      </div>
    </div>
  )
}

export default PatientTreatmentPlanContainer;
