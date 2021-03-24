import React, { useEffect, useState } from 'react';

import { CircularProgress, Typography } from '@material-ui/core';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  updateNotesSelector,
} from '../../../../redux/selectors/rootSelector';
import { textForKey } from '../../../../utils/localization';
import AppointmentNote from './AppointmentNote';
import styles from '../../../../styles/AppointmentNotes.module.scss';
import { toast } from "react-toastify";
import axios from "axios";
import { baseAppUrl } from "../../../../eas.config";

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
      const response = await axios.get(`${baseAppUrl}/api/patients/${patient.id}/visits`);
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
