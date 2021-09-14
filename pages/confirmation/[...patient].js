import React, { useState } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import moment from 'moment-timezone';
import { useRouter } from "next/router";
import Head from "next/head";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify';

import AppLogoBlue from '../../app/components/icons/appLogoBlue';
import LoadingButton from '../../components/common/LoadingButton';
import urlToLambda from '../../utils/urlToLambda';
import { textForKey } from '../../utils/localization';
import { fetchScheduleConfirmationInfo, requestConfirmSchedule } from "../../middleware/api/schedules";
import styles from '../../styles/ScheduleConfirmation.module.scss';
import Box from "@material-ui/core/Box";

const ConfirmationModal = dynamic(() => import('../../app/components/common/modals/ConfirmationModal'));

const Confirmation = ({ schedule, scheduleId, patientId }) => {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isError, setIsError] = useState(false);

  const confirmSchedule = async () => {
    if (schedule.status === 'Confirmed') {
      return;
    }
    setIsConfirming(true);
    try {
      await requestConfirmSchedule(scheduleId, patientId);
      setIsError(false);
      await router.replace(router.asPath);
    } catch (error) {
      toast.error(error.message);
      setIsError(true);
    } finally {
      setIsConfirming(false);
    }
  };

  const cancelSchedule = async () => {
    handleCloseConfirmation();
    setIsCanceling(true);
    try {
      await requestConfirmSchedule(scheduleId, patientId, 'Canceled', textForKey('canceled_by_patient'));
      setIsError(false);
      await router.replace(router.asPath);
    } catch (error) {
      toast.error(error.message);
      setIsError(true);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleCancelSchedule = () => {
    if (schedule.status === 'Canceled') {
      return;
    }
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  }

  const logoSrc = schedule?.clinicLogo
    ? urlToLambda(schedule.clinicLogo, 130)
    : null;

  return (
    <div className={styles.scheduleConfirmationRoot}>
      <Head>
        <title>
          {
            schedule?.clinicName != null
              ? `${schedule.clinicName} - ${textForKey('Confirmation')}`
              : `EasyPlan.pro - ${textForKey('Confirmation')}`
          }
        </title>
      </Head>
      <ConfirmationModal
        show={showConfirmation}
        title={textForKey('cancel_schedule_title')}
        message={textForKey('cancel_schedule_message')}
        primaryBtnText={textForKey('Yes')}
        onConfirm={cancelSchedule}
        onClose={handleCloseConfirmation}
      />
      {schedule == null && (
        <Typography className={styles['no-data-label']}>
          {textForKey('Schedule info not found')}
        </Typography>
      )}
      {logoSrc && (
        <img className={styles['logo-image']} src={logoSrc} alt='Clinic logo'/>
      )}
      {schedule != null && !isError && (
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
              {schedule.clinicPhone && (
                <TableRow>
                  <TableCell>
                    <Typography align='right' className={styles['data-label']}>
                      {textForKey('Phone number')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className={styles['data-label']}>
                      <a href={`tel:${schedule.clinicPhone.replace('+', '')}`}>
                        {schedule.clinicPhone}
                      </a>
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {schedule != null && (
        <Box display="flex" alignItems="center">
          {schedule.status !== 'Canceled' && (
            <LoadingButton
              isLoading={isConfirming}
              disabled={isConfirming || isCanceling || schedule.status !== 'Pending'}
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
          {schedule.status !== 'Confirmed' && (
            <LoadingButton
              isLoading={isCanceling}
              disabled={isConfirming || isCanceling || schedule.status === 'Canceled'}
              className='delete-button'
              onClick={handleCancelSchedule}
            >
              {schedule.status !== 'Canceled'
                ? textForKey('cancel_schedule')
                : textForKey('Canceled')}
            </LoadingButton>
          )}
        </Box>
      )}

      <div className={styles.covidNoticeContainer}>
        <Typography align='right' className={styles.covidNoticeTitle}>
          {textForKey('covid_notice_title')}
        </Typography>
        <Typography align='right' className={styles.covidNotice}>
          {textForKey('covid_notice')}
        </Typography>
      </div>

      <div className={styles.footer}>
        <Typography className={styles.label}>
          powered by{' '}
          <a href='https://easyplan.pro' target='_blank' rel='noreferrer'>
            <AppLogoBlue/>
          </a>
        </Typography>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
  try {
    const { patient } = query
    const [scheduleId, patientId] = patient;
    const { data: schedule } = await fetchScheduleConfirmationInfo(scheduleId, patientId, req.headers);
    return {
      props: {
        patient,
        schedule,
        scheduleId,
        patientId
      },
    };
  } catch (error) {
    throw error;
  }
}

export default Confirmation;
