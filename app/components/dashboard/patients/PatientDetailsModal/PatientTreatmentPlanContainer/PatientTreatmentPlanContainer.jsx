import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { useTranslate } from 'react-polyglot';
import EASTextField from 'app/components/common/EASTextField';
import PatientTreatmentPlan from 'app/components/common/PatientTreatmentPlan';
import NotificationsContext from 'app/context/notificationsContext';
import getTreatmentPlanURL from 'app/utils/getTreatmentPlanURL';
import { fetchPatientTreatmentPlan } from '../../../../../../middleware/api/patients';
import styles from './PatientTreatmentPlanContainer.module.scss';

const PatientTreatmentPlanContainer = ({
  currentUser,
  currentClinic,
  authToken,
  patientId,
}) => {
  const textForKey = useTranslate();
  const toast = useContext(NotificationsContext);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [guideName, setGuideName] = useState(
    `${currentUser.firstName} ${currentUser.lastName}`,
  );
  const canPrint = scheduleData?.services?.length > 0;

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    setIsLoading(true);
    try {
      const { data: treatmentPlan } = await fetchPatientTreatmentPlan(
        patientId,
      );
      setScheduleData(treatmentPlan);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintTreatmentPlan = () => {
    const { treatmentPlan } = scheduleData;
    if (treatmentPlan.services.length === 0) {
      return;
    }
    const planUrl = getTreatmentPlanURL(
      currentClinic,
      authToken,
      patientId,
      guideName,
    );
    window.open(planUrl, '_blank');
  };

  const handleGuideNameChange = (newValue) => {
    setGuideName(newValue);
  };

  return (
    <div className={styles.patientTreatmentPlanContainer}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('treatment plan')}
      </Typography>
      <div className={styles.planWrapper}>
        {isLoading && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar' />
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
      {!isLoading && canPrint && (
        <div className={styles.footer}>
          <EASTextField
            fieldLabel={textForKey('enter guide name')}
            value={guideName}
            containerClass={styles.guideNameField}
            onChange={handleGuideNameChange}
          />
          <Button
            classes={{
              root: styles.printBtn,
              label: styles.label,
            }}
            onPointerUp={handlePrintTreatmentPlan}
          >
            {textForKey('print plan')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatientTreatmentPlanContainer;
