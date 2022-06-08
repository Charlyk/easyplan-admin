import React, { useContext, useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import NotificationsContext from 'app/context/notificationsContext';
import { getPatientHistory } from 'middleware/api/patients';
import HistoryItem from './HistoryItem';
import styles from './PatientHistory.module.scss';

const PatientHistory = ({ patient, clinic }) => {
  const textForKey = useTranslate();
  const toast = useContext(NotificationsContext);
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState({ page: 1, itemsPerPage: 10 });
  const [historyData, setHistoryData] = useState({ data: [], total: 0 });

  useEffect(() => {
    if (patient != null) {
      fetchHistories();
    }
  }, [patient, pageData]);

  const fetchHistories = async () => {
    setIsLoading(true);
    try {
      const response = await getPatientHistory(
        patient.id,
        pageData.page,
        pageData.itemsPerPage,
      );
      setHistoryData(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (event, page) => {
    setPageData({ ...pageData, page });
  };

  return (
    <div className={styles['patient-history']}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('history of changes')}
      </Typography>
      {historyData.data.length === 0 && !isLoading && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('no data here yet')} :(
        </Typography>
      )}
      {isLoading && (
        <CircularProgress classes={{ root: 'circular-progress-bar' }} />
      )}
      <div className={styles['patient-history__history-data']}>
        {historyData.data.map((item) => (
          <HistoryItem key={item.id} clinic={clinic} item={item} />
        ))}
      </div>
      {historyData.total > 0 && (
        <div className={styles.footer}>
          <Pagination
            count={Math.round(historyData.total / 10)}
            page={pageData.page}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default PatientHistory;

PatientHistory.propTypes = {
  patient: PropTypes.object,
};
