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
import { toast } from 'react-toastify';

import AppLogoBlue from '../../components/icons/appLogoBlue';
import LoadingButton from '../../components/common/LoadingButton';
import { urlToLambda } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';

import styles from '../../styles/ScheduleConfirmation.module.scss';
import axios from "axios";
import { baseAppUrl } from "../../eas.config";
import { useRouter } from "next/router";

const ScheduleConfirmation = () => {
  const router = useRouter();
  const { schedule: scheduleId, patient: patientId } = router.query;
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getScheduleInfo();
  }, [scheduleId, patientId]);

  const getScheduleInfo = async () => {
    setIsLoading(true);
    try {
      const query = { scheduleId, patientId };
      const queryString = new URLSearchParams(query).toString();
      const response = await axios.get(`${baseAppUrl}/api/schedules/confirm?${queryString}`);
      setSchedule(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSchedule = async () => {
    setIsConfirming(true);
    try {
      const requestBody = { scheduleId, patientId };
      await axios.post(`${baseAppUrl}/api/schedules/confirm`, requestBody);
      setIsError(false);
      await getScheduleInfo();
    } catch (error) {
      toast.error(error.message);
      setIsError(true);
    } finally {
      setIsConfirming(false);
    }
  };

  const logoSrc = schedule?.clinicLogo
    ? urlToLambda(schedule.clinicLogo, 130)
    : null;

  return (
    <div className={styles.scheduleConfirmationRoot}>
      {isLoading && (
        <div className='progress-bar-wrapper'>
          <CircularProgress className='circular-progress-bar' />
        </div>
      )}
      {!isLoading && schedule == null && (
        <Typography className={styles['no-data-label']}>
          {textForKey('Schedule info not found')}
        </Typography>
      )}
      {logoSrc && (
        <img className={styles['logo-image']} src={logoSrc} alt='Clinic logo' />
      )}
      {schedule != null && !isLoading && !isError && (
        <TableContainer className={styles['table-container']}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} align='center'>
                  <Typography className={styles['title-label']}>
                    {textForKey('Detalii programare')}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography align='right' className={styles['data-label']}>
                    {textForKey('Date')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className={styles['data-label']}>
                    {moment(schedule.startTime)
                      .tz(schedule.timeZone)
                      .format('DD.MM.YYYY')}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='right'>
                  <Typography className={styles['data-label']}>
                    {textForKey('Hour')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className={styles['data-label']}>
                    {moment(schedule.startTime)
                      .tz(schedule.timeZone)
                      .format('HH:mm')}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography align='right' className={styles['data-label']}>
                    {textForKey('Doctor')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className={styles['data-label']}>
                    {schedule.doctorName}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography align='right' className={styles['data-label']}>
                    {textForKey('Service')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className={styles['data-label']}>
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
          disabled={isConfirming || schedule.status !== 'Pending'}
          className={clsx('positive-button', {
            [styles['confirmed']]: schedule.status !== 'Pending',
          })}
          onClick={confirmSchedule}
        >
          {schedule.status !== 'Pending'
            ? textForKey('Confirmed')
            : textForKey('Confirm')}
        </LoadingButton>
      )}

      <div className={styles.footer}>
        <Typography className={styles.label}>
          powered by{' '}
          <a href='https://easyplan.pro' target='_blank' rel='noreferrer'>
            <AppLogoBlue />
          </a>
        </Typography>
      </div>
    </div>
  );
};

export default ScheduleConfirmation;
