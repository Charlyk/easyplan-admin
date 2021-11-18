import React, { useEffect, useReducer, useRef } from 'react';
import dynamic from 'next/dynamic';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/Done';
import Button from '@material-ui/core/Button';
import Chip from "@material-ui/core/Chip";
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { baseApiUrl } from "../../../../../eas.config";
import {
  getAvailableHours,
  getScheduleDetails,
  updateScheduleStatus
} from "../../../../../middleware/api/schedules";
import IconArrowDown from '../../../icons/iconArrowDown';
import IconClose from '../../../icons/iconClose';
import IconEdit from '../../../icons/iconEdit';
import IconTrash from '../../../icons/iconTrash';
import {
  setPatientDetails, setPaymentModal,
  toggleAppointmentsUpdate,
} from '../../../../../redux/actions/actions';
import { updateInvoiceSelector } from '../../../../../redux/selectors/invoicesSelector';
import {
  deleteScheduleSelector,
  updateScheduleSelector,
} from '../../../../../redux/selectors/scheduleSelector';
import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";
import { ManualStatuses, Statuses } from '../../../../utils/constants';
import formattedAmount from '../../../../utils/formattedAmount';
import { textForKey } from '../../../../utils/localization';
import reducer, {
  initialState,
  setIsLoading,
  setDetails,
  setIsCanceledReasonRequired,
  setIsNewDateRequired,
  setIsDelayTimeRequired,
  setScheduleStatus,
  setShowStatuses,
} from "./AppointmentDetails.reducer";
import styles from './AppointmentDetails.module.scss';

const SingleInputModal = dynamic(() => import('../../../common/modals/SingleInputModal'));
const EasyDatePickerModal = dynamic(() => import("../../../common/modals/EasyDatePickerModal"));
const DelayTimeModal = dynamic(() => import("../../../common/modals/DelayTimeModal"));

const AppointmentDetails = (
  {
    schedule,
    onClose,
    onDelete,
    onEdit,
    onPayDebt,
    onAddSchedule,
  }
) => {
  const dispatch = useDispatch();
  const statusesAnchor = useRef(null);
  const [{
    details,
    isLoading,
    showStatuses,
    isCanceledReasonRequired,
    scheduleStatus,
    isNewDateRequired,
    isDelayTimeRequired,
  }, localDispatch] = useReducer(reducer, initialState);
  const updateSchedule = useSelector(updateScheduleSelector);
  const deleteSchedule = useSelector(deleteScheduleSelector);
  const updateInvoice = useSelector(updateInvoiceSelector);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  useEffect(() => {
    if (schedule == null) {
      return;
    }
    fetchAppointmentDetails(schedule);
    localDispatch(setScheduleStatus(
      Statuses.find((item) => item.id === schedule.scheduleStatus),
    ))
  }, [schedule]);

  useEffect(() => {
    if (updateSchedule != null && schedule.id === updateSchedule.id) {
      fetchAppointmentDetails(updateSchedule);
    }
  }, [updateSchedule]);

  useEffect(() => {
    if (deleteSchedule != null && deleteSchedule.id === schedule.id) {
      // close details fi current schedule was deleted
      onClose();
    }
  }, [deleteSchedule]);

  useEffect(() => {
    if (updateInvoice == null) {
      return;
    }

    const newDebts = updateInvoice.remainedAmount > 0
      ? details.patient.debts.map((item) => {
        if (item.id !== updateInvoice.id) {
          return item;
        }
        return updateInvoice;
      })
      : details.patient.debts.filter((item) => item.id !== updateInvoice.id);
    localDispatch(setDetails({
      ...details,
      patient: {
        ...details.patient,
        debts: newDebts
      },
    }));
  }, [updateInvoice]);

  const handleKeyDown = (event) => {
    if (event?.keyCode === 27 && !isLoading) {
      onClose?.();
    }
  };

  const fetchAppointmentDetails = async (schedule) => {
    if (schedule == null) {
      return;
    }
    localDispatch(setIsLoading(true));
    try {
      const response = await getScheduleDetails(schedule.id);
      const { data: details } = response;
      localDispatch(setDetails(details));
    } catch (error) {
      toast?.error(error.message);
    } finally {
      localDispatch(setIsLoading(false));
    }
  };

  const fetchHours = async () => {
    const query = {
      doctorId: details.doctor.id,
      serviceId: details.service.id,
      date: moment(details.startTime).format('YYYY-MM-DD'),
      scheduleId: schedule.id,
    }
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
    dispatch(setPaymentModal({ open: true, isNew: true, invoice: null, schedule }));
  }

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

  const changeScheduleStatus = async (status, canceledReason = null, newDate = null, delayTime = null) => {
    try {
      localDispatch(setScheduleStatus(status));
      closeStatusesList();
      await updateScheduleStatus(
        schedule.id,
        status.id,
        { canceledReason, newDate, delayTime }
      );
      localDispatch(setIsCanceledReasonRequired(false));
      localDispatch(setIsNewDateRequired(false));
      localDispatch(setIsDelayTimeRequired(false));
      dispatch(toggleAppointmentsUpdate());
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
        onDelete: null,
      }),
    );
  };

  const handleAddSchedule = () => {
    onAddSchedule?.(null, null, null, null, details.patient);
  };

  const isFinished =
    scheduleStatus.id === 'CompletedNotPaid' ||
    scheduleStatus.id === 'CompletedPaid' ||
    scheduleStatus.id === 'PartialPaid' ||
    scheduleStatus.id === 'CompletedFree';

  const patientName = details?.patient.fullName || schedule.patient.fullName;
  const serviceName = details?.service.name || schedule.serviceName;
  const serviceColor = details?.service.color || schedule.serviceColor;

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
                  <div
                    role='button'
                    tabIndex={0}
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
                        <DoneIcon/>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );

  return (
    <div
      className={clsx(
        styles.appointmentDetailsRoot,
        {
          [styles.urgent]: details?.isUrgent || details?.urgent
        },
      )}
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
        title={`${textForKey('Why schedule is canceled')}?`}
        label={textForKey('Enter reason below')}
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
        <Box display="flex" alignItems="center">
          <div
            role='button'
            tabIndex={0}
            onClick={onClose}
            className={styles.closeButton}
          >
            <IconClose/>
          </div>
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
            <IconEdit fill="#3A83DC"/>
          </IconButton>
        )}
      </div>
      <div className={styles.contentWrapper}>
        {isLoading && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar'/>
          </div>
        )}
        {!isLoading && details != null && (
          <div className={styles.infoWrapper}>
            <div
              ref={statusesAnchor}
              role='button'
              tabIndex={0}
              onClick={!isFinished ? openStatusesList : () => null}
              className={styles.scheduleStatus}
              style={{
                color: scheduleStatus.color,
                backgroundColor: `${scheduleStatus.color}1A`,
                border: `${scheduleStatus.color} 1px solid`,
              }}
            >
              {scheduleStatus.name}
              <IconArrowDown fill={scheduleStatus.color}/>
            </div>
            <div className={styles.scheduleInfoWrapper}>
              <table>
                <tbody>
                <tr>
                  <td colSpan={2}>
                    <div className={styles.groupTitle}>{textForKey('Info')}</div>
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
                    {textForKey('Doctor')}:
                  </td>
                  <td>{details.doctor.fullName}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '1rem', userSelect: 'none', }}>
                    {textForKey('Date')}:
                  </td>
                  <td>
                    {upperFirst(
                      moment(details.startTime).format('dddd, DD MMM YYYY'),
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '1rem', userSelect: 'none', }}>
                    {textForKey('Hour')}:
                  </td>
                  <td>
                    {moment(details.startTime).format('HH:mm')} -{' '}
                    {moment(details.endTime).format('HH:mm')}
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '1rem', userSelect: 'none', }}>
                    {upperFirst(textForKey('Created by'))}:
                  </td>
                  <td>{details.createdBy.fullName}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '1rem', userSelect: 'none', }}>
                    {upperFirst(textForKey('Created at'))}:
                  </td>
                  <td>
                    {moment(details.created).format('DD MMM YYYY, HH:mm')}
                  </td>
                </tr>
                {scheduleStatus.id === 'Canceled' && details.canceledReason != null && (
                  <tr>
                    <td style={{ paddingRight: '1rem', userSelect: 'none', }}>
                      {upperFirst(textForKey('Canceled reason'))}:
                    </td>
                    <td>{details.canceledReason}</td>
                  </tr>
                )}
                {scheduleStatus.id === 'Late' && details.delayTime > 0 && (
                  <tr>
                    <td style={{ paddingRight: '1rem', userSelect: 'none', }}>
                      {upperFirst(textForKey('delaytime'))}:
                    </td>
                    <td>{details.delayTime} min</td>
                  </tr>
                )}
                {details.noteText?.length > 0 && (
                  <tr>
                    <td valign='top' style={{ paddingRight: '1rem', userSelect: 'none', }}>
                      {textForKey('Note')}:
                    </td>
                    <td valign='top'>{details.noteText}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={2}>
                    <div className={styles.groupTitle}>{textForKey('Patient')}</div>
                  </td>
                </tr>
                {details.patient.tags.length > 0 && (
                  <tr>
                    <td colSpan={2}>
                      <div className={styles.tagsContainer}>
                        {details.patient.tags.map(tag => (
                          <Chip
                            size="small"
                            key={tag.id}
                            variant="outlined"
                            label={tag.title}
                            classes={{
                              root: styles.tagItem,
                              label: styles.label,
                              outlined: styles.outlined
                            }}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={{ paddingRight: '1rem', userSelect: 'none', }}>
                    {textForKey('Name')}:
                  </td>
                  <td>
                    <div
                      role='button'
                      tabIndex={0}
                      onClick={handlePatientClick}
                      className={styles.patientName}
                    >
                      {details.patient.fullName}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '1rem', userSelect: 'none', }}>
                    {textForKey('Phone')}:
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
                  <td style={{ paddingRight: '1rem', userSelect: 'none', }}>
                    {textForKey('Email')}:
                  </td>
                  <td>
                    <a href={`mailto:${details.patient.email}`} className={styles.patientLink}>
                      {details.patient.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} align="center">
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
              <div className={styles.groupTitle}>{textForKey('Debts')}</div>
              <table>
                <thead>
                <tr>
                  <td align='left'>{textForKey('Service')}</td>
                  <td align='left'>{textForKey('Clinic')}</td>
                  <td align='right'>{textForKey('Remained')}</td>
                  <td align='right'>{textForKey('Actions')}</td>
                </tr>
                </thead>
                <tbody>
                {details.patient.debts.map((item) => (
                  <tr key={item.id}>
                    <td align='left' className={styles.servicesCell}>
                      <Typography noWrap classes={{ root: styles.servicesLabel }}>
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
                        {textForKey('Pay')}
                      </Button>
                    </td>
                  </tr>
                ))}
                {details.patient.debts.length === 0 && (
                  <tr>
                    <td colSpan={4} align='center'>
                      <div className={styles.noDebtsLabel}>
                        {textForKey('No debts found')}
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
          <Button
            className='cancel-button'
            onPointerUp={onClose}
          >
            {textForKey('Close')}
            <IconClose/>
          </Button>
          <Button
            className='positive-button'
            disabled={isLoading || scheduleStatus.id !== 'OnSite'}
            onPointerUp={handleFinalizeSchedule}
          >
            {textForKey('Finalize')}
          </Button>
          <Button
            className='delete-button'
            disabled={isFinished || isLoading}
            onPointerUp={handleDeleteSchedule}
          >
            {textForKey('Delete')}
            <IconTrash/>
          </Button>
        </Box>
        {(scheduleStatus.id === 'CompletedPaid' ||
          scheduleStatus.id === 'PartialPaid') && (
          <a
            href={`${baseApiUrl}/invoices/receipt/${schedule.id}?mode=schedule`}
            target='_blank'
            rel='noreferrer'
          >
            <span className={styles.printLabel}>{textForKey('Print receipt')}</span>
          </a>
        )}
      </div>
    </div>
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
  onPayDebt: () => null,
};
