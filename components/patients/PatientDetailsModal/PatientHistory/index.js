import React, { useEffect, useState } from 'react';

import { CircularProgress, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import dataAPI from '../../../../utils/api/dataAPI';
import { textForKey } from '../../../../utils/localization';
import HistoryItem from './HistoryItem';
import styles from '../../../../styles/PatientHistory.module.scss';
import axios from "axios";
import { baseAppUrl } from "../../../../eas.config";

const PatientHistory = ({ patient }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    if (patient != null) {
      fetchHistories();
    }
  }, [patient]);

  const fetchHistories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseAppUrl}/api/patients/${patient.id}/history`);
      setHistories(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['patient-history']}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('History of changes')}
      </Typography>
      {histories.length === 0 && !isLoading && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      {isLoading && <CircularProgress classes={{ root: 'circular-progress-bar' }} />}
      <div className={styles['patient-history__history-data']}>
        {histories.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default PatientHistory;

PatientHistory.propTypes = {
  patient: PropTypes.object,
};
