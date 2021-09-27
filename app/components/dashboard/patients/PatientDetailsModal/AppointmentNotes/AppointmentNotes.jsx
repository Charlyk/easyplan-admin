import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography'
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

import {
  updateNotesSelector,
} from '../../../../../../redux/selectors/rootSelector';
import { textForKey } from '../../../../../../utils/localization';
import { getPatientVisits } from "../../../../../../middleware/api/patients";
import AppointmentNote from './AppointmentNote';
import styles from './AppointmentNotes.module.scss';

const AppointmentNotes = ({ currentUser, patient, onEditNote }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [visits, setVisits] = useState([]);
  const updateNotes = useSelector(updateNotesSelector);

  useEffect(() => {
    fetchPatientVisits();
  }, [patient, updateNotes]);

  const fetchPatientVisits = async () => {
    setIsFetching(true);
    try {
      const response = await getPatientVisits(patient.id);
      setVisits(sortBy(response.data, (item) => item.created).reverse() || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetching(false)
    }
  };

  return (
    <div className={styles['patient-visits-list']}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Appointments notes')}
      </Typography>
      {visits.length === 0 && !isFetching && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      <div className={styles['patient-visits-list__visits-data']}>
        {isFetching && (
          <div className='progress-bar-wrapper'>
            <CircularProgress classes={{ root: 'circular-progress-bar' }} />
          </div>
        )}
        {visits.map((visit, index) => (
          <AppointmentNote
            canEdit={visit.doctorId === currentUser.id}
            key={`${visit.scheduleId}-${visit.doctorId}-${visit.created}-${index}`}
            visit={visit}
            onEdit={onEditNote}
          />
        ))}
      </div>
    </div>
  );
};

export default AppointmentNotes;

AppointmentNotes.propTypes = {
  onEditNote: PropTypes.func,
  scheduleId: PropTypes.string,
  patient: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

AppointmentNotes.defaultProps = {
  onAddNote: () => null,
};
