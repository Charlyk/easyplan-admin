import React, { useContext, useEffect, useReducer, useRef } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/Done';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import IconArrowDown from 'app/components/icons/iconArrowDown';
import IconClose from 'app/components/icons/iconClose';
import IconEdit from 'app/components/icons/iconEdit';
import IconTrash from 'app/components/icons/iconTrash';
import NotificationsContext from 'app/context/notificationsContext';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import {
  ManualStatuses as rawManualStatuses,
  Statuses as rawStatuses,
} from 'app/utils/constants';
import formattedAmount from 'app/utils/formattedAmount';
import useMappedValue from 'app/utils/hooks/useMappedValue';
import { baseApiUrl } from 'eas.config';
import {
  getAvailableHours,
  updateScheduleStatus,
} from 'middleware/api/schedules';
import { setPaymentModal } from 'redux/actions/actions';
import {
  calendarScheduleDetailsSelector,
  closeDetailsSelector,
} from 'redux/selectors/scheduleSelector';
import {
  closeScheduleDetails,
  fetchScheduleDetails,
} from 'redux/slices/calendarData';
import {
  setPatientDetails,
  updateAppointmentsList,
} from 'redux/slices/mainReduxSlice';
import styles from './AppointmentDetails.module.scss';
import reducer, {
  initialState,
  setIsCanceledReasonRequired,
  setIsNewDateRequired,
  setIsDelayTimeRequired,
  setScheduleStatus,
  setShowStatuses,
} from './AppointmentDetails.reducer';

const SingleInputModal = dynamic(() =>
  import('app/components/common/modals/SingleInputModal'),
);
const EasyDatePickerModal = dynamic(() =>
  import('app/components/common/modals/EasyDatePickerModal'),
);
const DelayTimeModal = dynamic(() =>
  import('app/components/common/modals/DelayTimeModal'),
);

const AppointmentDetails = ({
  schedule,
  onClose,
  onDelete,
  onEdit,
  onPayDebt,
  onAddSchedule,
}) => {
  const textForKey = useTranslate();
  const Statuses = useMappedValue(rawStatuses);
  const ManualStatuses = useMappedValue(rawManualStatuses);
  const toast = useContext(NotificationsContext);
  const dispatch = useDispatch();
  const statusesAnchor = useRef(null);
  const [
    {
      isLoading,
      showStatuses,
      isCanceledReasonRequired,
      scheduleStatus,
      isNewDateRequired,
      isDelayTimeRequired,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);
  const details = useSelector(calendarScheduleDetailsSelector);
  const closeDetails = useSelector(closeDetailsSelector);

  useEffect(() => {
    return () => {
      dispatch(closeScheduleDetails(false));
    };
  }, []);

  useEffect(() => {
    if (details == null) {
      return;
    }

    localDispatch(
      setScheduleStatus(
        Statuses.find((item) => item.id === details.scheduleStatus),
      ),
    );
  }, [details]);

  useEffect(() => {
    if (closeDetails) {
      onClose();
    }
  }, [closeDetails]);

  useEffect(() => {
    if (schedule == null) {
      return;
    }
    dispatch(fetchScheduleDetails(schedule.id));
    localDispatch(
      setScheduleStatus(
        Statuses.find((item) => item.id === schedule.scheduleStatus),
      ),
    );
  }, [schedule]);

  const handleKeyDown = (event) => {
    if (event?.keyCode === 27 && !isLoading) {
      onClose?.();
    }
  };

  const fetchHours = async () => {
    const query = {
      doctorId: details.doctor.id,
      serviceId: details.service.id,
      date: moment(details.startTime).format('YYYY-MM-DD'),
      scheduleId: schedule.id,
    };
    return getAvailableHours(query);
  };

  const handleEditSchedule = () => {
    if (isFinished || isLoading) {
      return;
    }
    onEdit(details);
  };

  const handleFinalizeSchedule = () => {
    if (isLoading || scheduleStatus.id !== 'OnSite') {
      return;
    }
    dispatch(
      setPaymentModal({ open: true, isNew: true, invoice: null, schedule }),
    );
  };

  const handleDeleteSchedule = () => {
    if (isFinished || isLoading) {
      return;
    }
    onDelete(schedule);
  };

  const handlePayDebt = async (debt) => {
    onPayDebt(debt);
  };

  const openStatusesList = () => {
    localDispatch(setShowStatuses(true));
  };

  const closeStatusesList = () => {
    localDispatch(setShowStatuses(false));
  };

  const changeScheduleStatus = async (
    status,
    canceledReason = null,
    newDate = null,
    delayTime = null,
  ) => {
    try {
      localDispatch(setScheduleStatus(status));
      closeStatusesList();
      await updateScheduleStatus(schedule.id, status.id, {
        canceledReason,
        newDate,
        delayTime,
      });
      localDispatch(setIsCanceledReasonRequired(false));
      localDispatch(setIsNewDateRequired(false));
      localDispatch(setIsDelayTimeRequired(false));
      dispatch(updateAppointmentsList());
    } catch (error) {
      toast?.error(error.message);
    }
  };

  const handleStatusSelected = async (status) => {
    if (status.id === scheduleStatus?.id) {
      localDispatch(setShowStatuses(false));
      return;
    }

    if (status.id === 'Canceled') {
      localDispatch(setIsCanceledReasonRequired(true));
      return;
    }

    if (status.id === 'Late') {
      localDispatch(setIsDelayTimeRequired(true));
      return;
    }

    if (status.id === 'Rescheduled') {
      localDispatch(setIsNewDateRequired(true));
      return;
    }
    await changeScheduleStatus(status);
  };

  const handleDelayTimeSubmitted = async (delayTime) => {
    const status = Statuses.find((item) => item.id === 'Late');
    await changeScheduleStatus(status, null, null, delayTime);
  };

  const handleCanceledReasonSubmitted = async (canceledReason) => {
    const status = Statuses.find((item) => item.id === 'Canceled');
    await changeScheduleStatus(status, canceledReason);
  };

  const handleRescheduleDateSelected = async (newDate) => {
    const status = Statuses.find((item) => item.id === 'Rescheduled');
    await changeScheduleStatus(status, null, newDate);
  };

  const handleCloseCanceledReasonModal = () => {
    localDispatch(setIsCanceledReasonRequired(false));
  };

  const handleCloseDateModal = () => {
    localDispatch(setIsNewDateRequired(false));
  };

  const handleCloseDelayModal = () => {
    localDispatch(setIsDelayTimeRequired(false));
  };

  const handlePatientClick = () => {
    dispatch(
      setPatientDetails({
        show: true,
        patientId: schedule.patient.id,
        canDelete: false,
      }),
    );
  };

  const handleAddSchedule = () => {
    onAddSchedule?.(null, null, null, null, details.patient);
  };

  const handleCloseDetails = () => {
    dispatch(closeScheduleDetails(true));
  };

  const isFinished =
    scheduleStatus.id === 'CompletedNotPaid' ||
    scheduleStatus.id === 'CompletedPaid' ||
    scheduleStatus.id === 'PartialPaid' ||
    scheduleStatus.id === 'CompletedFree';

  const patientName = details?.patient?.fullName || schedule.patient.fullName;
  const serviceName = details?.service?.name || schedule.serviceName;
  const serviceColor = details?.service?.color || schedule.serviceColor;

  const statusesList = (
    <Popper
      disablePortal
      className={styles.statusesPopperRoot}
      anchorEl={statusesAnchor.current}
      open={showStatuses}
      placement='bottom'
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={styles.paper}>
            <ClickAwayListener onClickAway={closeStatusesList}>
              <div>
                {ManualStatuses.map((status) => (
                  <Box
                    onClick={() => handleStatusSelected(status)}
                    className={styles.item}
                    key={status.id}
                  >
                    <div className={styles.nameAndIcon}>
                      {status.icon}
                      {status.name}
                    </div>
                    {scheduleStatus.id === status.id && (
                      <div className={styles.checkmarkWrapper}>
                        <DoneIcon />
                      </div>
                    )}
                  </Box>
                ))}
              </div>
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );

  return (
    <Box
      className={clsx(styles.appointmentDetailsRoot, {
        [styles.urgent]: details?.isUrgent || details?.urgent,
      })}
      onKeyDown={handleKeyDown}
    >
      <DelayTimeModal
        open={isDelayTimeRequired}
        onSave={handleDelayTimeSubmitted}
        onClose={handleCloseDelayModal}
      />
      <SingleInputModal
        onSubmit={handleCanceledReasonSubmitted}
        onClose={handleCloseCanceledReasonModal}
        open={isCanceledReasonRequired}
        title={`${textForKey('why schedule is canceled')}?`}
        label={textForKey('enter reason below')}
      />
      {isNewDateRequired && (
        <EasyDatePickerModal
          open
          isHourRequired
          fetchHours={fetchHours}
          onClose={handleCloseDateModal}
          onSelected={handleRescheduleDateSelected}
          minDate={new Date()}
          selectedDate={moment(details.startTime).toDate()}
        />
      )}
      {statusesList}
      <div className={styles.headerWrapper}>
        <Box display='flex' alignItems='center'>
          <Box onClick={handleCloseDetails} className={styles.closeButton}>
            <IconClose />
          </Box>
          <span className={styles.scheduleTitle}>
            {patientName}:{' '}
            <span style={{ color: serviceColor }}>{serviceName}</span>
          </span>
        </Box>
        {!isFinished && (
          <IconButton
            className={styles.editButton}
            disabled={isFinished || isLoading}
            onPointerUp={handleEditSchedule}
          >
            <IconEdit fill='#3A83DC' />
          </IconButton>
        )}
      </div>
      <div className={styles.contentWrapper}>
        {isLoading && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar' />
          </div>
        )}
        {!isLoading && details != null && (
          <div className={styles.infoWrapper}>
            <Box
              ref={statusesAnchor}
              onClick={!isFinished ? openStatusesList : () => null}
              className={styles.scheduleStatus}
              style={{
                color: scheduleStatus.color,
                backgroundColor: `${scheduleStatus.color}1A`,
                border: `${scheduleStatus.color} 1px solid`,
              }}
            >
              {scheduleStatus.name}
              <IconArrowDown fill={scheduleStatus.color} />
            </Box>
            <div className={styles.scheduleInfoWrapper}>
              <table>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <div className={styles.groupTitle}>
                        {textForKey('info')}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: '35%',
                        paddingRight: '1rem',
                        userSelect: 'none',
                      }}
                    >
                      {textForKey('doctor')}:
                    </td>
                    <td>{details.doctor.fullName}</td>
                  </tr>
                  {details.cabinet && (
                    <tr>
                      <td
                        style={{
                          width: '35%',
                          paddingRight: '1rem',
                          userSelect: 'none',
                        }}
                      >
                        {textForKey('cabinet')}:
                      </td>
                      <td>{details.cabinet.name}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ paddingRight: '1rem', userSelect: 'none' }}>
                      {textForKey('date')}:
                    </td>
                    <td>
                      {upperFirst(
                        moment(details.startTime).format('dddd, DD MMM YYYY'),
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '1rem', userSelect: 'none' }}>
                      {textForKey('hour')}:
                    </td>
                    <td>
                      {moment(details.startTime).format('HH:mm')} -{' '}
                      {moment(details.endTime).format('HH:mm')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '1rem', userSelect: 'none' }}>
                      {upperFirst(textForKey('created by'))}:
                    </td>
                    <td>{details.createdBy.fullName}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '1rem', userSelect: 'none' }}>
                      {upperFirst(textForKey('created at'))}:
                    </td>
                    <td>
                      {moment(details.created).format('DD MMM YYYY, HH:mm')}
                    </td>
                  </tr>
                  {scheduleStatus.id === 'Canceled' &&
                    details.canceledReason != null && (
                      <tr>
                        <td
                          style={{ paddingRight: '1rem', userSelect: 'none' }}
                        >
                          {upperFirst(textForKey('canceled reason'))}:
                        </td>
                        <td>{details.canceledReason}</td>
                      </tr>
                    )}
                  {scheduleStatus.id === 'Late' && details.delayTime > 0 && (
                    <tr>
                      <td style={{ paddingRight: '1rem', userSelect: 'none' }}>
                        {upperFirst(textForKey('delaytime'))}:
                      </td>
                      <td>{details.delayTime} min</td>
                    </tr>
                  )}
                  {details.noteText?.length > 0 && (
                    <tr>
                      <td
                        valign='top'
                        style={{ paddingRight: '1rem', userSelect: 'none' }}
                      >
                        {textForKey('note')}:
                      </td>
                      <td valign='top'>{details.noteText}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={2}>
                      <div className={styles.groupTitle}>
                        {textForKey('patient')}
                      </div>
                    </td>
                  </tr>
                  {details.patient.tags.length > 0 && (
                    <tr>
                      <td colSpan={2}>
                        <div className={styles.tagsContainer}>
                          {details.patient.tags.map((tag) => (
                            <Chip
                              size='small'
                              key={tag.id}
                              variant='outlined'
                              label={tag.title}
                              classes={{
                                root: styles.tagItem,
                                label: styles.label,
                                outlined: styles.outlined,
                              }}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ paddingRight: '1rem', userSelect: 'none' }}>
                      {textForKey('name')}:
                    </td>
                    <td>
                      <Box
                        onClick={handlePatientClick}
                        className={styles.patientName}
                      >
                        {details.patient.fullName}
                      </Box>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '1rem', userSelect: 'none' }}>
                      {textForKey('phone')}:
                    </td>
                    <td>
                      <a
                        href={`tel:${details.patient.countryCode}${details.patient.phoneNumber}`}
                        className={styles.patientLink}
                      >
                        {`+${details.patient.countryCode}${details.patient.phoneNumber}`}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '1rem', userSelect: 'none' }}>
                      {textForKey('email')}:
                    </td>
                    <td>
                      <a
                        href={`mailto:${details.patient.email}`}
                        className={styles.patientLink}
                      >
                        {details.patient.email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} align='center'>
                      <Button
                        className={styles.addScheduleBtn}
                        onClick={handleAddSchedule}
                      >
                        {textForKey('add_new_appointment')}
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.debtsWrapper}>
              <div className={styles.groupTitle}>{textForKey('debts')}</div>
              <table>
                <thead>
                  <tr>
                    <td align='left'>{textForKey('service')}</td>
                    <td align='left'>{textForKey('clinic')}</td>
                    <td align='right'>{textForKey('remained')}</td>
                    <td align='right'>{textForKey('actions')}</td>
                  </tr>
                </thead>
                <tbody>
                  {details.patient.debts.map((item) => (
                    <tr key={item.id}>
                      <td align='left' className={styles.servicesCell}>
                        <Typography
                          noWrap
                          classes={{ root: styles.servicesLabel }}
                        >
                          {item.services.join(', ')}
                        </Typography>
                      </td>
                      <td align='left' className={styles.totalsCell}>
                        <Typography
                          noWrap
                          classes={{ root: styles.clinicNameLabel }}
                        >
                          {item.clinicName}
                        </Typography>
                      </td>
                      <td align='right' className={styles.remainedCell}>
                        {formattedAmount(item.remainedAmount, item.currency)}
                      </td>
                      <td align='right' className={styles.actionsCell}>
                        <Button
                          disableRipple
                          variant='text'
                          classes={{
                            root: styles.btnOutlinePrimary,
                            label: styles.label,
                          }}
                          onClick={() => handlePayDebt(item)}
                        >
                          {textForKey('pay')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {details.patient.debts.length === 0 && (
                    <tr>
                      <td colSpan={4} align='center'>
                        <div className={styles.noDebtsLabel}>
                          {textForKey('no debts found')}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className={styles.footerWrapper}>
        <Box width='100%' display='flex'>
          <Button className='cancel-button' onPointerUp={onClose}>
            {textForKey('close')}
            <IconClose />
          </Button>
          <Button
            className='positive-button'
            disabled={isLoading || scheduleStatus.id !== 'OnSite'}
            onPointerUp={handleFinalizeSchedule}
          >
            {textForKey('finalize')}
          </Button>
          <Button
            className='delete-button'
            disabled={isFinished || isLoading}
            onPointerUp={handleDeleteSchedule}
          >
            {textForKey('delete')}
            <IconTrash />
          </Button>
        </Box>
        {(scheduleStatus.id === 'CompletedPaid' ||
          scheduleStatus.id === 'PartialPaid') && (
          <a
            href={`${baseApiUrl}/invoices/receipt/${schedule.id}?mode=schedule`}
            target='_blank'
            rel='noreferrer'
          >
            <span className={styles.printLabel}>
              {textForKey('print receipt')}
            </span>
          </a>
        )}
      </div>
    </Box>
  );
};

export default React.memo(AppointmentDetails, areComponentPropsEqual);

AppointmentDetails.propTypes = {
  onClose: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onPayDebt: PropTypes.func,
  onAddSchedule: PropTypes.func,
  schedule: PropTypes.shape({
    id: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    start: PropTypes.object,
    end: PropTypes.object,
    scheduleStatus: PropTypes.string,
    canceledReason: PropTypes.string,
    isUrgent: PropTypes.bool,
    urgent: PropTypes.bool,
    delayTime: PropTypes.number,
  }),
};

AppointmentDetails.defaultProps = {
  onClose: () => null,
  onEdit: () => null,
  onDelete: () => null,
};
