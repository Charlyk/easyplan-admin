import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { toast } from "react-toastify";
import CloudDownload from "@material-ui/icons/CloudDownload";
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import moment from "moment-timezone";
import Button from "@material-ui/core/Button";

import { getPatientPhoneRecords } from "../../../../../../middleware/api/patients";
import { textForKey } from "../../../../../../utils/localization";
import IconIncomeCall from "../../../../icons/iconIncomeCall";
import IconOutCall from "../../../../icons/IconOutCall";
import styles from './PatientPhoneRecords.module.scss';

const RecordItem = ({ record, onDownload }) => {
  const handleRecordDownload = () => {
    onDownload(record);
  };

  return (
    <div className={styles.recordItem}>
      <Box display='flex' alignItems="center">
        {record.type === 'Income' ? (
          <IconIncomeCall />
        ) : (
          <IconOutCall />
        )}
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
      <IconButton classes={{ root: styles.downloadButton }} onClick={handleRecordDownload}>
        <CloudDownload style={{ fill: '#3A83DC' }}/>
      </IconButton>
    </div>
  )
}

const PatientPhoneRecords = ({ patient }) => {
  const [page, setPage] = useState(0);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (patient == null) {
      return;
    }

    fetchPhoneRecords();
  }, [patient, page]);

  const fetchPhoneRecords = async () => {
    setIsLoading(true);
    try {
      setRecords([]);
      const response = await getPatientPhoneRecords(patient.id, page);
      const { data } = response;
      setRecords(data)
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextClick = () => {
    if (records.length < 30) {
      return;
    }
    setPage(page + 1);
  }

  const handlePrevClick = () => {
    if (page === 0) {
      return;
    }
    setPage(page - 1);
  }

  const handleRecordDownload = (record) => {
    const recordDate = moment(record.date);
    const year = recordDate.format('YYYY')
    const month = recordDate.format('MM')
    const date = recordDate.format('DD')
    const recordUrl =
      `https://sip6215.iphost.md/monitor/${year}/${month}/${date}/${record.recordingFile}`
    window.open(recordUrl, '_blank');
  }

  return (
    <div className={styles.phoneRecordsRoot}>
      <Typography classes={{ root: 'title-label' }}>
        {textForKey('Phone records')}
      </Typography>
      {isLoading && <CircularProgress classes={{ root: 'circular-progress-bar' }}/>}
      {records.length === 0 && !isLoading && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('No data here yet')} :(
        </Typography>
      )}
      <div className={styles.recordsWrapper}>
        {records.map((item, index) => (
          <RecordItem
            key={`${item.id}-${index}`}
            record={item}
            onDownload={handleRecordDownload}
          />
        ))}
      </div>
      <div className={styles.footer}>
        <Button
          variant="outlined"
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
          variant="outlined"
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
  )
}

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
}
