import React, { useEffect, useRef, useState } from 'react';

import upperFirst from 'lodash/upperFirst';
import moment from 'moment';
import PropTypes from 'prop-types';
import './styles.scss';
import { Button, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import IconArrowDown from '../../assets/icons/iconArrowDown';
import IconClose from '../../assets/icons/iconClose';
import IconEdit from '../../assets/icons/iconEdit';
import IconTrash from '../../assets/icons/iconTrash';
import { toggleAppointmentsUpdate } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { ManualStatuses, Statuses } from '../../utils/constants';
import { textForKey } from '../../utils/localization';

import DoneIcon from '@material-ui/icons/Done';
import { ClickAwayListener, Fade, Paper, Popper } from '@material-ui/core';

const AppointmentDetails = ({
  schedule,
  onClose,
  onDelete,
  onEdit,
  onPayDebt,
}) => {
  const dispatch = useDispatch();
  const statusesAnchor = useRef(null);
  const [{ patient }, setDetails] = useState({
    patient: null,
    schedule: null,
  });
  const [loadingDebt, setLoadingDebt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStatuses, setShowStatuses] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState(
    Statuses.find(item => item.id === schedule.status),
  );

  useEffect(() => {
    fetchAppointmentDetails();
    setScheduleStatus(Statuses.find(item => item.id === schedule.status));
  }, [schedule]);

  const fetchAppointmentDetails = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchScheduleDetails(schedule.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      setDetails(response.data);
    }
    setIsLoading(false);
  };

  const handleEditSchedule = () => {
    onEdit(schedule);
  };

  const handleDeleteSchedule = () => {
    onDelete(schedule);
  };

  const handlePayDebt = async debt => {
    setLoadingDebt(debt.invoiceId);
    const response = await dataAPI.fetchInvoiceDetails(debt.invoiceId);
    if (response.isError) {
      console.error(response.message);
    } else {
      onPayDebt(response.data);
    }
    setLoadingDebt(null);
  };

  const openStatusesList = () => {
    setShowStatuses(true);
  };

  const closeStatusesList = () => {
    setShowStatuses(false);
  };

  const handleStatusSelected = async status => {
    setScheduleStatus(status);
    closeStatusesList();
    await dataAPI.updateScheduleStatus(schedule.id, status.id);
    dispatch(toggleAppointmentsUpdate());
  };

  const isFinished =
    schedule.status === 'CompletedNotPaid' ||
    schedule.status === 'CompletedPaid' ||
    schedule.status === 'PartialPaid';

  const statusesList = (
    <Popper
      disablePortal
      className='statuses-popper-root'
      anchorEl={statusesAnchor.current}
      open={showStatuses}
      placement='bottom-start'
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className='statuses-popper-root__paper'>
            <ClickAwayListener onClickAway={closeStatusesList}>
              <div>
                {ManualStatuses.map(status => (
                  <div
                    role='button'
                    tabIndex={0}
                    onClick={() => handleStatusSelected(status)}
                    className={`statuses-popper-root__item`}
                    key={status.id}
                  >
                    <div className='name-and-icon'>
                      {status.icon}
                      {status.name}
                    </div>
                    {scheduleStatus.id === status.id && (
                      <div className='checkmark-wrapper'>
                        <DoneIcon />
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
    <div className='appointment-details-root'>
      {statusesList}
      <div className='header-wrapper'>
        <div
          role='button'
          tabIndex={0}
          onClick={onClose}
          className='close-button'
        >
          <IconClose />
        </div>
        <span className='schedule-title'>
          {schedule.patientName}:{' '}
          <span style={{ color: schedule.serviceColor }}>
            {schedule.serviceName}
          </span>
        </span>
      </div>
      <div className='content-wrapper'>
        {isLoading ? (
          <Spinner animation='border' className='spinner' />
        ) : (
          <div className='info-wrapper'>
            <div
              ref={statusesAnchor}
              role='button'
              tabIndex={0}
              onClick={!isFinished ? openStatusesList : () => null}
              className='schedule-status'
              style={{
                color: scheduleStatus.color,
                backgroundColor: `${scheduleStatus.color}1A`,
                border: `${scheduleStatus.color} 1px solid`,
              }}
            >
              {scheduleStatus.name}
              <IconArrowDown fill={scheduleStatus.color} />
            </div>
            <div className='schedule-info-wrapper'>
              <table>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <div className='group-title'>{textForKey('Info')}</div>
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
                    <td>{schedule.doctorName}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '1rem' }}>
                      {textForKey('Date')}:
                    </td>
                    <td>
                      {moment(schedule.dateAndTime).format('dddd, DD MMM YYYY')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '1rem' }}>
                      {textForKey('Hour')}:
                    </td>
                    <td>{moment(schedule.dateAndTime).format('HH:mm')}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '1rem' }}>
                      {upperFirst(textForKey('Created by'))}:
                    </td>
                    <td>{schedule.createdByName}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '1rem' }}>
                      {upperFirst(textForKey('Created at'))}:
                    </td>
                    <td>
                      {moment(schedule.created).format('DD MMM YYYY, HH:mm')}
                    </td>
                  </tr>
                  <tr>
                    <td valign='top' style={{ paddingRight: '1rem' }}>
                      {textForKey('Note')}:
                    </td>
                    <td valign='top'>{schedule.note}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className='group-title'>{textForKey('Patient')}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '1rem' }}>
                      {textForKey('Name')}:
                    </td>
                    <td>{schedule.patientName}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '1rem' }}>
                      {textForKey('Phone')}:
                    </td>
                    <td>
                      <a href={`tel:${schedule.patientPhone}`}>
                        {schedule.patientPhone}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingRight: '1rem' }}>
                      {textForKey('Email')}:
                    </td>
                    <td>
                      <a href={`mailto:${patient?.email}`}>{patient?.email}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='debts-wrapper'>
              <div className='group-title'>{textForKey('Debts')}</div>
              <table>
                <thead>
                  <tr>
                    <td align='left'>{textForKey('Service')}</td>
                    <td align='right'>{textForKey('Total')}</td>
                    <td align='right'>{textForKey('Remained')}</td>
                    <td align='right'>{textForKey('Actions')}</td>
                  </tr>
                </thead>
                <tbody>
                  {patient?.debts.map(item => (
                    <tr key={item.invoiceId}>
                      <td align='left'>{item.serviceName}</td>
                      <td align='right'>{item.amount}MDL</td>
                      <td align='right'>{item.amount - item.paid}MDL</td>
                      <td align='right'>
                        <Button
                          disabled={loadingDebt != null}
                          variant='outline-primary'
                          onClick={() => handlePayDebt(item)}
                        >
                          {loadingDebt === item.invoiceId ? (
                            <Spinner
                              animation='border'
                              className='pay-btn-spinner'
                            />
                          ) : (
                            textForKey('Pay')
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {patient?.debts.length === 0 && (
                    <tr>
                      <td colSpan={4} align='center'>
                        <div className='no-debts-label'>
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
      <div className='footer-wrapper'>
        <Button className='cancel-button' onClick={onClose}>
          {textForKey('Close')}
          <IconClose />
        </Button>
        <Button
          className='delete-button'
          disabled={isFinished}
          onClick={handleDeleteSchedule}
        >
          {textForKey('Delete')}
          <IconTrash />
        </Button>
        <Button
          className='positive-button'
          disabled={isFinished}
          onClick={handleEditSchedule}
        >
          {textForKey('Edit')}
          <IconEdit />
        </Button>
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
    id: PropTypes.string,
    patientId: PropTypes.string,
    patientName: PropTypes.string,
    patientPhone: PropTypes.string,
    doctorId: PropTypes.string,
    doctorName: PropTypes.string,
    serviceId: PropTypes.string,
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    serviceDuration: PropTypes.number,
    createdById: PropTypes.string,
    createdByName: PropTypes.string,
    created: PropTypes.string,
    dateAndTime: PropTypes.string,
    status: PropTypes.string,
    note: PropTypes.string,
  }),
};

AppointmentDetails.defaultProps = {
  onClose: () => null,
  onEdit: () => null,
  onDelete: () => null,
  onPayDebt: () => null,
};
