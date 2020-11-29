import React, { useEffect, useState } from 'react';

import {
  Typography,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from '@material-ui/core';
import clsx from 'clsx';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import dataAPI from '../../../../utils/api/dataAPI';
import { updateLink } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';

const PatientsList = ({ schedules, viewDate, filterData }) => {
  const [filteredSchedules, setFilteredSchedules] = useState(schedules);
  const [hours, setHours] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWorkingHours();
  }, [viewDate]);

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
    setIsLoading(true);
    const response = await dataAPI.fetchClinicWorkHoursV2(
      moment(viewDate).isoWeekday(),
    );
    if (response.isError) {
      console.error(response.message);
    } else {
      setHours(response.data.filter(it => it.split(':')[1] === '00'));
    }
    setIsLoading(false);
  };

  const schedulesForHour = hour => {
    const [hours] = hour.split(':');
    const schedules = filteredSchedules.filter(schedule => {
      const scheduleHour = moment(schedule.dateAndTime).format('HH');
      return hours === scheduleHour;
    });
    return sortBy(schedules, item => item.dateAndTime);
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
        className={clsx(
          'schedule-item',
          schedule.status === 'OnSite' && 'upcoming',
        )}
        style={{
          border: `${schedule.serviceColor} 1px solid`,
          backgroundColor: `${schedule.serviceColor}1A`,
        }}
      >
        <Typography noWrap classes={{ root: 'patient-name' }}>
          {schedule.patientName}
        </Typography>
        <Typography noWrap classes={{ root: 'service-name' }}>
          {schedule.serviceName}
        </Typography>
        <span className='time-label'>
          {startDate.format('HH:mm')} - {endDate.format('HH:mm')}
        </span>
        <div className='details-button'>
          <Link to={updateLink(`/${schedule.patientId}/${schedule.id}`)}>
            <span className='button-text'>{textForKey('Details')}</span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className='patients-list-root'>
      {!isLoading && hours.length === 0 && (
        <Typography classes={{ root: 'day-off-label' }}>
          {textForKey("It's a day off")}
        </Typography>
      )}
      <TableContainer classes={{ root: 'table-container' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {hours.map(item => (
                <TableCell align='center' key={item}>
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {hours.map(item => (
                <TableCell align='center' valign='top' key={`patients-${item}`}>
                  {schedulesForHour(item).map(renderPatientItem)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PatientsList;

PatientsList.propTypes = {
  viewDate: PropTypes.instanceOf(Date),
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
  viewDate: new Date(),
};
