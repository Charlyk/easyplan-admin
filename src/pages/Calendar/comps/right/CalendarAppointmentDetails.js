import React, { useEffect } from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';

import IconAppointmentCalendar from '../../../../assets/icons/iconAppointmentCalendar';
import IconAppointmentClock from '../../../../assets/icons/iconAppointmentClock';
import IconDelete from '../../../../assets/icons/iconDelete';
import IconEditService from '../../../../assets/icons/iconEditService';
import IconPhone from '../../../../assets/icons/iconPhone';
import { Action, Statuses } from '../../../../utils/constants';
import { logUserAction } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';

const CalendarAppointmentDetails = ({ schedule, onEdit, onDelete }) => {
  useEffect(() => {
    if (schedule != null) {
      logUserAction(Action.ViewAppointment, JSON.stringify(schedule));
    }
  }, [schedule]);

  if (schedule == null) {
    return null;
  }

  const scheduleDate = moment(schedule.dateAndTime, 'YYYY-MM-DD HH:mm');
  const scheduleStatus = Statuses.find(item => item.id === schedule.status);

  const handleEditSchedule = () => {
    onEdit(schedule);
  };

  const handleDeleteSchedule = () => {
    onDelete(schedule);
  };

  return (
    <div className='appointment-details'>
      <div className='appointment-details-header'>
        <div className='service-name-container'>
          <div
            className='color-indicator'
            style={{ backgroundColor: schedule.serviceColor }}
          />
          <span className='service-name'>{schedule.serviceName}</span>
        </div>
        <div className='actions-container'>
          <div
            role='button'
            tabIndex={0}
            className='delete-button'
            onClick={handleDeleteSchedule}
          >
            <IconDelete />
          </div>
          <div
            role='button'
            tabIndex={0}
            className='edit-button'
            onClick={handleEditSchedule}
          >
            <IconEditService />
          </div>
        </div>
      </div>
      <div className='appointment-details-data'>
        <div
          className='appointment-status-wrapper'
          style={{ backgroundColor: `${scheduleStatus.color}1A` }}
        >
          <span
            className='status-name-label'
            style={{ color: scheduleStatus.color }}
          >
            {scheduleStatus.name}
          </span>
        </div>
        <div className='doctor-info'>
          <div className='info-row'>
            <span className='info-row-title'>{schedule.doctorName}</span>
          </div>
          <div className='info-row'>
            <IconAppointmentCalendar />
            <span className='info-row-text'>
              {scheduleDate.format('DD MMM YYYY')}
            </span>
          </div>
          <div className='info-row'>
            <IconAppointmentClock />
            <span className='info-row-text'>
              {scheduleDate.format('HH:mm')}
            </span>
          </div>
        </div>
        <div className='patient-info'>
          <div className='info-row'>
            <span className='info-row-title'>{textForKey('Patient')}:</span>
            <span className='info-row-text'>{schedule.patientName}</span>
          </div>
          <div className='info-row'>
            <IconPhone />
            <span className='info-row-text'>{schedule.patientPhone}</span>
          </div>
          <div className='info-row'>
            <span className='info-row-title'>Notes</span>
          </div>
          <div className='info-row'>
            <span className='info-row-text'>
              {schedule.note.length > 0
                ? schedule.note
                : textForKey('No notes')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarAppointmentDetails;

CalendarAppointmentDetails.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
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

CalendarAppointmentDetails.defaultProps = {
  onEdit: () => null,
  onDelete: () => null,
};
