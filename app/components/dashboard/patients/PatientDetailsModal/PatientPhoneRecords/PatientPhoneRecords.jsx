import React, { useEffect, useMemo, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PhoneIcon from '@material-ui/icons/Call';
import OutgoingCallIcon from '@material-ui/icons/CallMade';
import FailedCallIcon from '@material-ui/icons/CallMissed';
import IncomeCallIcon from '@material-ui/icons/CallReceived';
import CloudDownload from '@material-ui/icons/CloudDownload';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import getCallRecordUrl from 'app/utils/getCallRecordUrl';
import { textForKey } from 'app/utils/localization';
import { playPhoneCallRecord } from '../../../../../../redux/slices/mainReduxSlice';
import PhoneCallItem from '../../../../crm/DealDetails/RightContainer/DealHistory/PhoneCallItem';
import styles from './PatientPhoneRecords.module.scss';
import { dispatchFetchCallRecords } from './PatientPhoneRecords.reducer';
import { patientPhoneRecordsSelector } from './PatientPhoneRecords.selector';

const RecordItem = ({ record, onDownload }) => {
  const callIcon = useMemo(() => {
    switch (record.direction) {
      case 'Incoming':
        return <IncomeCallIcon className={styles.arrowIcon} />;
      case 'Outgoing':
        return <OutgoingCallIcon className={styles.arrowIcon} />;
      default:
        return <FailedCallIcon className={styles.arrowIcon} />;
    }
  }, [record]);

  const handleRecordDownload = () => {
    onDownload(record);
  };

  return (
    <div className={styles.recordItem}>
      <Box display='flex' alignItems='center'>
        <div className={styles.iconWrapper}>
          <PhoneIcon />
          {callIcon}
        </div>
        <Box>
          <Typography classes={{ root: styles.dateLabel }}>
            {record.date}
          </Typography>
          <Box flex='1' display='flex'>
            <Typography classes={{ root: styles.operatorLabel }}>
              {textForKey('Operator')}: {record.destination};
            </Typography>
            <Typography classes={{ root: styles.operatorLabel }}>
              {textForKey('Status')}: {textForKey(record.status)};
            </Typography>
            <Typography classes={{ root: styles.operatorLabel }}>
              {textForKey('Duration')}: {record.duration}s;
            </Typography>
          </Box>
        </Box>
      </Box>
      <IconButton
        classes={{ root: styles.downloadButton }}
        onClick={handleRecordDownload}
      >
        <CloudDownload style={{ fill: '#3A83DC' }} />
      </IconButton>
    </div>
  );
};

const PatientPhoneRecords = ({ patient }) => {
  const dispatch = useDispatch();
  const { isFetching, records } = useSelector(patientPhoneRecordsSelector);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (patient == null) {
      return;
    }

    fetchPhoneRecords();
  }, [patient, page]);

  const fetchPhoneRecords = () => {
    dispatch(dispatchFetchCallRecords({ patientId: patient.id, page }));
  };

  const handleNextClick = () => {
    if (records.length < 30) {
      return;
    }
    setPage(page + 1);
  };

  const handlePrevClick = () => {
    if (page === 0) {
      return;
    }
    setPage(page - 1);
  };

  const handlePlayRecord = (record) => {
    if (record?.fileUrl == null) {
      return;
    }
    dispatch(playPhoneCallRecord(record));
  };

  return (
    <div className={styles.phoneRecordsRoot}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Phone records')}
      </Typography>
      {isFetching && (
        <CircularProgress classes={{ root: 'circular-progress-bar' }} />
      )}
      {records.length === 0 && !isFetching && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      <div className={styles.recordsWrapper}>
        {records.map((item) => (
          <PhoneCallItem
            key={item.id}
            call={item}
            onPlayAudio={handlePlayRecord}
          />
        ))}
      </div>
      <div className={styles.footer}>
        <Button
          variant='outlined'
          disabled={page === 0}
          classes={{
            root: styles.navButtons,
            label: styles.label,
            outlined: styles.outlined,
            disabled: styles.disabled,
          }}
          onClick={handlePrevClick}
        >
          {textForKey('Previous')}
        </Button>
        <Button
          variant='outlined'
          disabled={records.length < 30}
          classes={{
            root: styles.navButtons,
            label: styles.label,
            outlined: styles.outlined,
            disabled: styles.disabled,
          }}
          onClick={handleNextClick}
        >
          {textForKey('Next')}
        </Button>
      </div>
    </div>
  );
};

export default PatientPhoneRecords;

RecordItem.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.number,
    date: PropTypes.string,
    destination: PropTypes.string,
    duration: PropTypes.number,
    phone: PropTypes.string,
    recordingFile: PropTypes.string,
    status: PropTypes.string,
    type: PropTypes.oneOf(['Incoming', 'Outgoing']),
  }),
  onDownload: PropTypes.func,
};
