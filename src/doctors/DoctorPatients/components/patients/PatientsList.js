import React, { useEffect, useState } from 'react';

import { Typography } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import dataAPI from '../../../../utils/api/dataAPI';
import { textForKey } from '../../../../utils/localization';

const PatientsList = ({ schedules, filterData }) => {
  const [filteredSchedules, setFilteredSchedules] = useState(schedules);
  const [hours, setHours] = useState([]);

  useEffect(() => {
    fetchWorkingHours();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [filterData]);

  useEffect(() => {
    setFilteredSchedules(schedules);
    filterPatients();
  }, [schedules]);

  const filterPatients = () => {
    setFilteredSchedules(
      schedules.filter(schedule => {
        return (
          (filterData.patientName.length === 0 ||
            schedule.patientName
              .toLowerCase()
              .includes(filterData.patientName.toLowerCase()) ||
            schedule.patientPhone.includes(
              filterData.patientName.toLowerCase(),
            )) &&
          (schedule == null ||
            filterData.serviceId === 'all' ||
            schedule.serviceId === filterData.serviceId) &&
          (schedule == null ||
            filterData.appointmentStatus === 'all' ||
            filterData.appointmentStatus === schedule.status)
        );
      }),
    );
  };

  const fetchWorkingHours = async () => {
    const response = await dataAPI.fetchClinicWorkHoursV2(
      moment().isoWeekday(),
    );
    if (response.isError) {
      console.error(response.message);
    } else {
      setHours(response.data.filter(it => it.split(':')[1] === '00'));
    }
  };

  const schedulesForHour = hour => {
    const [hours] = hour.split(':');
    return filteredSchedules.filter(schedule => {
      const scheduleHour = moment(schedule.dateAndTime).format('HH:mm');
      const [scheduleHours] = scheduleHour.split(':');
      return hours === scheduleHours;
    });
  };

  const renderPatientItem = schedule => {
    if (schedule == null) {
      return null;
    }

    const startDate = moment(schedule.dateAndTime);
    const endDate = moment(schedule.dateAndTime).add(
      schedule.serviceDuration,
      'minutes',
    );

    return (
      <div
        key={schedule.id}
        className='schedule-item'
        style={{
          border: `${schedule.serviceColor} 1px solid`,
          backgroundColor: `${schedule.serviceColor}1A`,
        }}
      >
        <span className='patient-name'>{schedule.patientName}</span>
        <Typography noWrap classes={{ root: 'service-name' }}>
          {schedule.serviceName}
        </Typography>
        <span className='time-label'>
          {startDate.format('HH:mm')} - {endDate.format('HH:mm')}
        </span>
        <div className='details-button'>
          <Link to={`/${schedule.patientId}/${schedule.id}`}>
            <span className='button-text'>{textForKey('Details')}</span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className='patients-list-root'>
      <table>
        <thead>
          <tr>
            {hours.map(item => (
              <td
                align='center'
                style={{ width: `calc(100% / ${hours.length})` }}
                key={item}
              >
                {item}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {hours.map(item => (
              <td align='center' valign='top' key={`patients-${item}`}>
                {schedulesForHour(item).map(renderPatientItem)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PatientsList;

PatientsList.propTypes = {
  filterData: PropTypes.shape({
    patientName: PropTypes.string,
    serviceId: PropTypes.string,
    appointmentStatus: PropTypes.string,
  }),
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      schedule: PropTypes.shape({
        id: PropTypes.string,
        patientId: PropTypes.string,
        patientName: PropTypes.string,
        patientPhone: PropTypes.string,
        patientPhoto: PropTypes.string,
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
      patient: PropTypes.shape({
        id: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        fullName: PropTypes.string,
        email: PropTypes.string,
        phoneNumber: PropTypes.string,
        photo: PropTypes.string,
      }),
    }),
  ),
};

PatientsList.defaultProps = {
  onPatientSelect: () => null,
};
