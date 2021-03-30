import React, { useEffect, useReducer, useRef } from 'react';

import {
  Box,
  CircularProgress,
  ClickAwayListener,
  Fade,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import styles from '../../../styles/AppointmentDetails.module.scss';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import IconArrowDown from '../../icons/iconArrowDown';
import IconClose from '../../icons/iconClose';
import IconEdit from '../../icons/iconEdit';
import IconTrash from '../../icons/iconTrash';
import {
  setPatientDetails,
  toggleAppointmentsUpdate,
} from '../../../redux/actions/actions';
import { updateInvoiceSelector } from '../../../redux/selectors/invoicesSelector';
import {
  deleteScheduleSelector,
  updateScheduleSelector,
} from '../../../redux/selectors/scheduleSelector';
import { ManualStatuses, Statuses } from '../../../utils/constants';
import { formattedAmount } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import SingleInputModal from '../../common/SingleInputModal';
import { baseApiUrl } from "../../../eas.config";
import { getAvailableHours, getScheduleDetails, updateScheduleStatus } from "../../../middleware/api/schedules";
import { reducer, initialState, actions } from "./AppointmentDetails.reducer";
import EasyDatePickerModal from "../../common/EasyDatePickerModal";

const AppointmentDetails = (
  {
    schedule,
    onClose,
    onDelete,
    onEdit,
    onPayDebt,
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
    isNewDateRequired
  }, localDispatch] = useReducer(reducer, initialState);
  const updateSchedule = useSelector(updateScheduleSelector);
  const deleteSchedule = useSelector(deleteScheduleSelector);
  const updateInvoice = useSelector(updateInvoiceSelector);

  useEffect(() => {
    if (schedule == null) {
      return;
    }
    fetchAppointmentDetails(schedule);
    localDispatch(actions.setScheduleStatus(
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

    const newDebts = details.patient.debts.map((item) => {
      if (item.id !== updateInvoice.id) {
        return item;
      }
      return updateInvoice;
    });
    localDispatch(actions.setDetails({
      ...details,
      patient: {
        ...details.patient,
        debts: newDebts
      },
    }));
  }, [updateInvoice]);

  const fetchAppointmentDetails = async (schedule) => {
    if (schedule == null) {
      return;
    }
    localDispatch(actions.setIsLoading(true));
    try {
      const response = await getScheduleDetails(schedule.id);
      const { data: details } = response;
      localDispatch(actions.setDetails(details));
      localDispatch(actions.setScheduleStatus(
        Statuses.find((item) => item.id === details.scheduleStatus),
      ))
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
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
  }

  const handleEditSchedule = () => {
    onEdit(schedule);
  };

  const handleDeleteSchedule = () => {
    onDelete(schedule);
  };

  const handlePayDebt = async (debt) => {
    onPayDebt(debt);
  };

  const openStatusesList = () => {
    localDispatch(actions.setShowStatuses(true));
  };

  const closeStatusesList = () => {
    localDispatch(actions.setShowStatuses(false));
  };

  const changeScheduleStatus = async (status, canceledReason = null, newDate = null) => {
    try {
      localDispatch(actions.setScheduleStatus(status));
      closeStatusesList();
      await updateScheduleStatus(
        schedule.id,
        status.id,
        { canceledReason, newDate }
      );
      localDispatch(actions.setIsCanceledReasonRequired(false));
      localDispatch(actions.setIsNewDateRequired(false));
      dispatch(toggleAppointmentsUpdate());
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusSelected = async (status) => {
    if (status.id === 'Canceled') {
      localDispatch(actions.setIsCanceledReasonRequired(true));
      return;
    }

    if (status.id === 'Rescheduled') {
      localDispatch(actions.setIsNewDateRequired(true));
      return;
    }
    await changeScheduleStatus(status);
  };

  const handleCanceledReasonSubmitted = async (canceledReason) => {
    const status = Statuses.find((item) => item.id === 'Canceled');
    await changeScheduleStatus(status, canceledReason);
  };

  const handleRescheduleDateSelected = async (newDate) => {
    const status = Statuses.find((item) => item.id === 'Rescheduled');
    await changeScheduleStatus(status, null, newDate);
  }

  const handleCloseCanceledReasonModal = () => {
    localDispatch(actions.setIsCanceledReasonRequired(false));
  };

  const handleCloseDateModal = () => {
    localDispatch(actions.setIsNewDateRequired(false));
  }

  const handlePatientClick = () => {
    dispatch(
      setPatientDetails({
        show: true,
        patientId: schedule.patient.id,
        onDelete: null,
      }),
    );
  };

  const isFinished =
    schedule.scheduleStatus === 'CompletedNotPaid' ||
    schedule.scheduleStatus === 'CompletedPaid' ||
    schedule.scheduleStatus === 'PartialPaid' ||
    schedule.scheduleStatus === 'Rescheduled' ||
    schedule.scheduleStatus === 'CompletedFree';

  const patientName = details?.patient.fullName || schedule.patient.fullName;
  const serviceName = details?.service.name || schedule.serviceName;
  const serviceColor = details?.service.color || schedule.serviceColor;

  const statusesList = (
    <Popper
      disablePortal
      className={styles['statuses-popper-root']}
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
                    <div className={styles['name-and-icon']}>
                      {status.icon}
                      {status.name}
                    </div>
                    {scheduleStatus.id === status.id && (
                      <div className={styles['checkmark-wrapper']}>
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
        styles['appointment-details-root'],
        { [styles.urgent]: schedule.isUrgent },
      )}
    >
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
      <div className={styles['header-wrapper']}>
        <div
          role='button'
          tabIndex={0}
          onClick={onClose}
          className={styles['close-button']}
        >
          <IconClose/>
        </div>
        <span className={styles['schedule-title']}>
          {patientName}:{' '}
          <span style={{ color: serviceColor }}>{serviceName}</span>
        </span>
      </div>
      <div className={styles['content-wrapper']}>
        {isLoading && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar'/>
          </div>
        )}
        {!isLoading && details != null && (
          <div className={styles['info-wrapper']}>
            <div
              ref={statusesAnchor}
              role='button'
              tabIndex={0}
              onClick={!isFinished ? openStatusesList : () => null}
              className={styles['schedule-status']}
              style={{
                color: scheduleStatus.color,
                backgroundColor: `${scheduleStatus.color}1A`,
                border: `${scheduleStatus.color} 1px solid`,
              }}
            >
              {scheduleStatus.name}
              <IconArrowDown fill={scheduleStatus.color}/>
            </div>
            <div className={styles['schedule-info-wrapper']}>
              <table>
                <tbody>
                <tr>
                  <td colSpan={2}>
                    <div className={styles['group-title']}>{textForKey('Info')}</div>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      width: '35%',
                      paddingRight: '1rem',
                    }}
                  >
                    {textForKey('Doctor')}:
                  </td>
                  <td>{details.doctor.fullName}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '1rem' }}>
                    {textForKey('Date')}:
                  </td>
                  <td>
                    {upperFirst(
                      moment(details.startTime).format('dddd, DD MMM YYYY'),
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '1rem' }}>
                    {textForKey('Hour')}:
                  </td>
                  <td>
                    {moment(details.startTime).format('HH:mm')} -{' '}
                    {moment(details.endTime).format('HH:mm')}
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '1rem' }}>
                    {upperFirst(textForKey('Created by'))}:
                  </td>
                  <td>{details.createdBy.fullName}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '1rem' }}>
                    {upperFirst(textForKey('Created at'))}:
                  </td>
                  <td>
                    {moment(details.created).format('DD MMM YYYY, HH:mm')}
                  </td>
                </tr>
                {scheduleStatus.id === 'Canceled' &&
                details.canceledReason != null && (
                  <tr>
                    <td style={{ paddingRight: '1rem' }}>
                      {upperFirst(textForKey('Canceled reason'))}:
                    </td>
                    <td>{details.canceledReason}</td>
                  </tr>
                )}
                {details.noteText?.length > 0 && (
                  <tr>
                    <td valign='top' style={{ paddingRight: '1rem' }}>
                      {textForKey('Note')}:
                    </td>
                    <td valign='top'>{details.noteText}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={2}>
                    <div className={styles['group-title']}>{textForKey('Patient')}</div>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '1rem' }}>
                    {textForKey('Name')}:
                  </td>
                  <td>
                    <div
                      role='button'
                      tabIndex={0}
                      onClick={handlePatientClick}
                      className={styles['patient-name']}
                    >
                      {details.patient.fullName}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '1rem' }}>
                    {textForKey('Phone')}:
                  </td>
                  <td>
                    <a
                      href={`tel:${details.patient.phoneNumber.replace(
                        '+',
                        '',
                      )}`}
                    >
                      {details.patient.phoneNumber}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingRight: '1rem' }}>
                    {textForKey('Email')}:
                  </td>
                  <td>
                    <a href={`mailto:${details.patient.email}`}>
                      {details.patient.email}
                    </a>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div className={styles['debts-wrapper']}>
              <div className={styles['group-title']}>{textForKey('Debts')}</div>
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
                    <td align='left' className={styles['services-cell']}>
                      <Typography noWrap classes={{ root: styles['services-label'] }}>
                        {item.services.join(', ')}
                      </Typography>
                    </td>
                    <td align='left' className={styles['totals-cell']}>
                      <Typography
                        noWrap
                        classes={{ root: styles['clinic-name-label'] }}
                      >
                        {item.clinicName}
                      </Typography>
                    </td>
                    <td align='right' className={styles['remained-cell']}>
                      {formattedAmount(item.remainedAmount, item.currency)}
                    </td>
                    <td align='right' className={styles['actions-cell']}>
                      <Button
                        variant='outline-primary'
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
                      <div className={styles['no-debts-label']}>
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
      <div className={styles['footer-wrapper']}>
        <Box width='100%' display='flex'>
          <Button className='cancel-button' onClick={onClose}>
            {textForKey('Close')}
            <IconClose/>
          </Button>
          <Button
            className='delete-button'
            disabled={isFinished}
            onClick={handleDeleteSchedule}
          >
            {textForKey('Delete')}
            <IconTrash/>
          </Button>
          <Button className='positive-button' onClick={handleEditSchedule}>
            {textForKey('Edit')}
            <IconEdit/>
          </Button>
        </Box>
        {(scheduleStatus.id === 'CompletedPaid' ||
          scheduleStatus.id === 'PartialPaid') && (
          <a
            href={`${baseApiUrl}/invoices/receipt/${schedule.id}?mode=schedule`}
            target='_blank'
            rel='noreferrer'
          >
            <span className={styles['print-label']}>{textForKey('Print receipt')}</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;

AppointmentDetails.propTypes = {
  onClose: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onPayDebt: PropTypes.func,
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
  }),
};

AppointmentDetails.defaultProps = {
  onClose: () => null,
  onEdit: () => null,
  onDelete: () => null,
  onPayDebt: () => null,
};
