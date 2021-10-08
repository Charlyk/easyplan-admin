import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { textForKey } from "../../../../../utils/localization";
import { fetchDoctorScheduleDetails } from "../../../../../../middleware/api/schedules";
import getTreatmentPlanURL from "../../../../../utils/getTreatmentPlanURL";
import PatientTreatmentPlan from "../../../../common/PatientTreatmentPlan";
import styles from './PatientTreatmentPlanContainer.module.scss';
import EASTextField from "../../../../common/EASTextField";

const PatientTreatmentPlanContainer = ({ currentUser, currentClinic, authToken, patientId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [guideName, setGuideName] = useState(`${currentUser.firstName} ${currentUser.lastName}`);

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

  const handlePrintTreatmentPlan = () => {
    const planUrl = getTreatmentPlanURL(currentClinic, authToken, patientId, guideName);
    window.open(planUrl, '_blank');
  }

  const handleGuideNameChange = (newValue) => {
    setGuideName(newValue);
  }

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
      {!isLoading && (
        <div className={styles.footer}>
          <EASTextField
            fieldLabel={textForKey('Enter guide name')}
            value={guideName}
            containerClass={styles.guideNameField}
            onChange={handleGuideNameChange}
          />
          <Button
            classes={{
              root: styles.printBtn,
              label: styles.label
            }}
            onPointerUp={handlePrintTreatmentPlan}
          >
            {textForKey('Print plan')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default PatientTreatmentPlanContainer;
