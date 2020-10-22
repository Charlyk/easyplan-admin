import React, { useEffect, useState } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import './styles.scss';
import { Button, Spinner } from 'react-bootstrap';

import IconClose from '../../assets/icons/iconClose';
import IconEdit from '../../assets/icons/iconEdit';
import IconTrash from '../../assets/icons/iconTrash';
import dataAPI from '../../utils/api/dataAPI';
import { ScheduleStatuses } from '../../utils/constants';
import { textForKey } from '../../utils/localization';

const AppointmentDetails = ({
  schedule,
  onClose,
  onDelete,
  onEdit,
  onPayDebt,
}) => {
  const [{ patient }, setDetails] = useState({
    patient: null,
    schedule: null,
  });
  const [loadingDebt, setLoadingDebt] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAppointmentDetails();
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

  const statusDetails = ScheduleStatuses.find(it => it.id === schedule.status);

  return (
    <div className='appointment-details-root'>
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
              className='schedule-status'
              style={{
                color: statusDetails.color,
                backgroundColor: `${statusDetails.color}1A`,
              }}
            >
              {statusDetails.name}
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
                    <td style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                      {textForKey('Doctor')}:
                    </td>
                    <td>{schedule.doctorName}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                      {textForKey('Date')}:
                    </td>
                    <td>
                      {moment(schedule.dateAndTime).format('dddd, DD MMM YYYY')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                      {textForKey('Hour')}:
                    </td>
                    <td>{moment(schedule.dateAndTime).format('HH:mm')}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className='group-title'>{textForKey('Patient')}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                      {textForKey('Name')}:
                    </td>
                    <td>{schedule.patientName}</td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                      {textForKey('Phone')}:
                    </td>
                    <td>
                      <a href={`tel:${schedule.patientPhone}`}>
                        {schedule.patientPhone}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
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
                    <td>{textForKey('Service')}</td>
                    <td align='right'>{textForKey('Total')}</td>
                    <td align='right'>{textForKey('Remained')}</td>
                    <td align='right'>{textForKey('Actions')}</td>
                  </tr>
                </thead>
                <tbody>
                  {patient?.debts.map(item => (
                    <tr key={item.invoiceId}>
                      <td>{item.serviceName}</td>
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
        <Button className='delete-button' onClick={handleDeleteSchedule}>
          {textForKey('Delete')}
          <IconTrash />
        </Button>
        <Button className='positive-button' onClick={handleEditSchedule}>
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
