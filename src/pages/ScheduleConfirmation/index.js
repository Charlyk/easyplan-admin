import React, { useEffect, useState } from 'react';

import { Box, CircularProgress, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import IconCheckMark from '../../assets/icons/iconCheckMark';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import './styles.scss';

const ScheduleConfirmation = () => {
  const { scheduleId, patientId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    confirmSchedule();
  }, [scheduleId, patientId]);

  const confirmSchedule = async () => {
    setIsLoading(true);
    const response = await dataAPI.setScheduleConfirmed(scheduleId, patientId);
    if (response.isError) {
      toast.error(textForKey(response.message));
      setIsSuccess(false);
    } else {
      setIsSuccess(true);
    }
    setIsLoading(false);
  };

  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      className='schedule-confirmation-root'
    >
      {isLoading && <CircularProgress style={{ color: '#3A83DC' }} />}
      {isSuccess && <IconCheckMark />}
      <Typography>
        {isLoading
          ? textForKey('Confirming schedule')
          : isSuccess
          ? textForKey('Confirmed')
          : 'Error'}
      </Typography>
    </Box>
  );
};

export default ScheduleConfirmation;
