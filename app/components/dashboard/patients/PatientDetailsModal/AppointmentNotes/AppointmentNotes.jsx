import React, { useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { textForKey } from 'app/utils/localization';
import { updateNotesSelector } from 'redux/selectors/rootSelector';
import AppointmentNote from './AppointmentNote';
import styles from './AppointmentNotes.module.scss';
import { dispatchFetchPatientVisits } from './AppointmentNotes.reducer';
import { appointmentNotesSelector } from './AppointmentNotes.selector';

const AppointmentNotes = ({ currentUser, patient, onEditNote }) => {
  const dispatch = useDispatch();
  const { isFetching, visits } = useSelector(appointmentNotesSelector);
  const updateNotes = useSelector(updateNotesSelector);

  useEffect(() => {
    dispatch(dispatchFetchPatientVisits(patient.id));
  }, [patient, updateNotes]);

  return (
    <div className={styles.patientVisitsList}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Appointments notes')}
      </Typography>
      {visits.length === 0 && !isFetching && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      <div className={styles.visitsData}>
        {visits.map((visit, index) => {
          const { doctor } = visit;
          return (
            <AppointmentNote
              canEdit={doctor.id === currentUser.id}
              key={`${visit.scheduleId}-${doctor.id}-${visit.created}-${index}`}
              visit={visit}
              onEdit={onEditNote}
            />
          );
        })}
        {isFetching && (
          <div className='progress-bar-wrapper'>
            <CircularProgress classes={{ root: 'circular-progress-bar' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentNotes;

AppointmentNotes.propTypes = {
  onEditNote: PropTypes.func,
  scheduleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  patient: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

AppointmentNotes.defaultProps = {
  onAddNote: () => null,
};
