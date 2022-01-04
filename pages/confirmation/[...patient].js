import React, { useContext, useState } from 'react';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment-timezone';
import Head from 'next/head';
import { useRouter } from 'next/router';
import EASImage from 'app/components/common/EASImage';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import EASModal from 'app/components/common/modals/EASModal';
import AppLogoBlue from 'app/components/icons/appLogoBlue';
import NotificationsContext from 'app/context/notificationsContext';
import styles from 'app/styles/ScheduleConfirmation.module.scss';
import checkIsMobileDevice from 'app/utils/checkIsMobileDevice';
import { textForKey } from 'app/utils/localization';
import urlToLambda from 'app/utils/urlToLambda';
import {
  fetchScheduleConfirmationInfo,
  requestConfirmSchedule,
} from 'middleware/api/schedules';

const Confirmation = ({ schedule, scheduleId, patientId }) => {
  const router = useRouter();
  const toast = useContext(NotificationsContext);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const isPending =
    schedule.status === 'Pending' || schedule.status === 'WaitingForPatient';

  const confirmSchedule = async () => {
    if (schedule.status === 'Confirmed') {
      return;
    }
    setIsConfirming(true);
    try {
      await requestConfirmSchedule(scheduleId, patientId);
      setIsError(false);
      await router.reload();
    } catch (error) {
      toast.error(error.message);
      setIsError(true);
    } finally {
      setIsConfirming(false);
    }
  };

  const cancelSchedule = async (message) => {
    const sentMessage =
      message === '' || message === null
        ? textForKey('canceled_by_patient')
        : message;
    setIsCanceling(true);
    try {
      await requestConfirmSchedule(
        scheduleId,
        patientId,
        'Canceled',
        sentMessage,
      );
      setIsError(false);
      await router.reload();
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
    setIsModalOpen(true);
  };

  const logoSource = schedule?.clinicLogo
    ? urlToLambda(schedule.clinicLogo)
    : null;

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = () => {
    cancelSchedule(inputValue);
    setIsModalOpen(false);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  return (
    <div className={styles.scheduleConfirmationRoot}>
      <Head>
        <title>
          {schedule?.clinicName != null
            ? `${schedule.clinicName} - ${textForKey('Confirmation')}`
            : `EasyPlan.pro - ${textForKey('Confirmation')}`}
        </title>
      </Head>
      {!schedule && (
        <Typography className={styles['no-data-label']}>
          {textForKey('Schedule info not found')}
        </Typography>
      )}
      {logoSource && (
        <EASImage className={styles['logo-image']} src={logoSource} />
      )}
      {schedule && !isError && (
        <TableContainer className={styles.tableContainer}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} align='center'>
                  <Typography className={styles.titleLabel}>
                    {textForKey('Detalii programare')}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography align='left' className={styles.dataLabel}>
                    {textForKey('Date')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className={styles.dataLabel}>
                    {moment(schedule.startTime)
                      .tz(schedule.timeZone)
                      ?.format('DD.MM.YYYY')}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align='left'>
                  <Typography className={styles.dataLabel}>
                    {textForKey('Hour')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className={styles.dataLabel}>
                    {moment(schedule.startTime)
                      .tz(schedule.timeZone)
                      ?.format('HH:mm')}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography align='left' className={styles.dataLabel}>
                    {textForKey('Doctor')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className={styles.dataLabel}>
                    {schedule.doctorName}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography align='left' className={styles.dataLabel}>
                    {textForKey('Service')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography className={styles.dataLabel}>
                    {schedule.service}
                  </Typography>
                </TableCell>
              </TableRow>
              {schedule.clinicPhone && (
                <TableRow>
                  <TableCell>
                    <Typography align='left' className={styles.dataLabel}>
                      {textForKey('Phone number')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className={styles.dataLabel}>
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
      {schedule && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LoadingButton
            isLoading={isConfirming}
            disabled={isConfirming || isCanceling || !isPending}
            className={clsx('positive-button', {
              [styles.confirmed]: schedule.status === 'Confirmed',
            })}
            onClick={confirmSchedule}
          >
            {isPending ? textForKey('Confirm') : textForKey(schedule.status)}
          </LoadingButton>
          {isPending && (
            <LoadingButton
              isLoading={isCanceling}
              disabled={isConfirming || isCanceling || !isPending}
              className='delete-button'
              onClick={handleCancelSchedule}
            >
              {textForKey('cancel_schedule')}
            </LoadingButton>
          )}
        </div>
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
        <div className={styles.label}>
          powered by{' '}
          <a href='https://easyplan.md' target='_blank' rel='noreferrer'>
            <AppLogoBlue />
          </a>
        </div>
      </div>

      <EASModal
        open={isModalOpen}
        size='small'
        onClose={handleModalClose}
        onBackdropClick={handleModalClose}
        primaryBtnText={textForKey('Confirm')}
        secondaryBtnText={textForKey('cancel_schedule')}
        onPrimaryClick={handleModalConfirm}
      >
        <Box padding='16px'>
          <Typography className={styles.modalConfirmation}>
            {textForKey('cancel_schedule_message')}
          </Typography>
          <EASTextField
            type='text'
            value={inputValue}
            onChange={handleInputChange}
          />
        </Box>
      </EASModal>
    </div>
  );
};

export default Confirmation;

export const getServerSideProps = async ({ req, query }) => {
  try {
    const isMobile = checkIsMobileDevice(req);
    const { patient } = query;
    const [scheduleId, patientId] = patient;
    const { data: schedule } = await fetchScheduleConfirmationInfo(
      scheduleId,
      patientId,
      req.headers,
    );
    return {
      props: {
        isMobile,
        patient,
        schedule,
        scheduleId,
        patientId,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {},
    };
  }
};
