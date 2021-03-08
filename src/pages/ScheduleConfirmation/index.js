import React, { useEffect, useState } from 'react';

import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment-timezone';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import AppLogoBlue from '../../../components/icons/appLogoBlue';
import LoadingButton from '../../../components/LoadingButton';
import dataAPI from '../../../utils/api/dataAPI';
import { urlToLambda } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';

import './ScheduleConfirmation.module.scss';

const ScheduleConfirmation = () => {
  const { scheduleId, patientId } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getScheduleInfo();
  }, [scheduleId, patientId]);

  const getScheduleInfo = async () => {
    setIsLoading(true);
    const response = await dataAPI.getScheduleInfo(scheduleId, patientId);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      setSchedule(response.data);
    }
    setIsLoading(false);
  };

  const confirmSchedule = async () => {
    setIsConfirming(true);
    const response = await dataAPI.setScheduleConfirmed(scheduleId, patientId);
    if (response.isError) {
      toast.error(textForKey(response.message));
      setIsError(true);
    } else {
      await getScheduleInfo();
    }
    setIsConfirming(false);
  };

  const logoSrc = schedule?.clinicLogo
    ? urlToLambda(schedule.clinicLogo, 130)
    : null;

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
      {isLoading && (
        <Box>
          <CircularProgress style={{ color: '#3A83DC' }} />
        </Box>
      )}
      {!isLoading && schedule == null && (
        <Typography classes={{ root: 'no-data-label' }}>
          {textForKey('Schedule info not found')}
        </Typography>
      )}
      {logoSrc && (
        <img className='logo-image' src={logoSrc} alt='Clinic logo' />
      )}
      {schedule != null && !isLoading && !isError && (
        <TableContainer classes={{ root: 'table-container' }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} align='center'>
                  <Typography classes={{ root: 'title-label' }}>
                    {textForKey('Detalii programare')}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography align='right' classes={{ root: 'data-label' }}>
                    {textForKey('Date')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography classes={{ root: 'data-label' }}>
                    {moment(schedule.startTime)
                      .tz(schedule.timeZone)
                      .format('DD.MM.YYYY')}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='right'>
                  <Typography classes={{ root: 'data-label' }}>
                    {textForKey('Hour')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography classes={{ root: 'data-label' }}>
                    {moment(schedule.startTime)
                      .tz(schedule.timeZone)
                      .format('HH:mm')}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography align='right' classes={{ root: 'data-label' }}>
                    {textForKey('Doctor')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography classes={{ root: 'data-label' }}>
                    {schedule.doctorName}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography align='right' classes={{ root: 'data-label' }}>
                    {textForKey('Service')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography classes={{ root: 'data-label' }}>
                    {schedule.service}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {schedule != null && !isLoading && (
        <LoadingButton
          isLoading={isConfirming}
          disabled={isConfirming || schedule.status === 'Confirmed'}
          className={clsx('positive-button', {
            confirmed: schedule.status === 'Confirmed',
          })}
          onClick={confirmSchedule}
        >
          {schedule.status === 'Confirmed'
            ? textForKey('Confirmed')
            : textForKey('Confirm')}
        </LoadingButton>
      )}

      <div className='footer'>
        <Typography classes={{ root: 'label' }}>
          powered by{' '}
          <a href='https://easyplan.pro' target='_blank' rel='noreferrer'>
            <AppLogoBlue />
          </a>
        </Typography>
      </div>
    </Box>
  );
};

export default ScheduleConfirmation;
