import React, { useEffect, useState } from 'react';

import {
  Typography,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Box,
} from '@material-ui/core';
import clsx from 'clsx';
import sortBy from 'lodash/sortBy';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

import { Statuses } from '../../../app/utils/constants';
import { textForKey } from '../../../utils/localization';
import Link from "next/link";
import styles from '../../../styles/patient/PatientsList.module.scss';
import { toast } from "react-toastify";
import axios from "axios";

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
      schedules.filter((schedule) => {
        return (
          (filterData.patientName.length === 0 ||
            schedule.patient.fullName
              .toLowerCase()
              ?.includes(filterData.patientName.toLowerCase()) ||
            schedule.patient.phoneNumber?.includes(
              filterData.patientName.toLowerCase(),
            )) &&
          (schedule == null ||
            filterData.serviceId === 'all' ||
            schedule.serviceId === filterData.serviceId) &&
          (schedule == null ||
            filterData.appointmentStatus === 'all' ||
            filterData.appointmentStatus === schedule.scheduleStatus)
        );
      }),
    );
  };

  const fetchWorkingHours = async () => {
    setIsLoading(true);
    try {
      const query = { weekday: moment(viewDate).isoWeekday(), period: 'day' };
      const queryString = new URLSearchParams(query).toString();
      const response = await axios.get(`/api/clinic/work-hours?${queryString}`);
      setHours(response.data.filter((it) => it.split(':')[1] === '00'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const schedulesForHour = (hour) => {
    const [hours] = hour.split(':');
    const schedules = filteredSchedules.filter((schedule) => {
      const scheduleHour = moment(schedule.startTime).format('HH');
      return hours === scheduleHour;
    });
    return sortBy(schedules, (item) => item.startTime);
  };

  const renderPatientItem = (schedule) => {
    if (schedule == null) {
      return null;
    }

    const startDate = moment(schedule.startTime);
    const endDate = moment(schedule.endTime);
    const scheduleStatus = Statuses.find(
      (item) => item.id === schedule.scheduleStatus,
    );

    return (
      <div
        key={schedule.id}
        className={clsx(
          styles['schedule-item'],
          schedule.scheduleStatus === 'OnSite' && styles.upcoming,
          schedule.isUrgent && styles.urgent,
        )}
      >
        <Box
          display='flex'
          flexDirection='column'
          alignItems='flex-start'
          justifyContent='flex-start'
          width='100%'
          overflow='hidden'
        >
          <div
            className={styles['schedule-item__status-indicator']}
            style={{ backgroundColor: scheduleStatus.color }}
          />
          <Typography noWrap classes={{ root: styles['patient-name'] }}>
            {schedule.patient.fullName}
          </Typography>
          <Typography noWrap classes={{ root: styles['service-name'] }}>
            {schedule.serviceName}
          </Typography>
          <Typography noWrap classes={{ root: styles['patient-name'] }}>
            {scheduleStatus.name}
          </Typography>
          <Typography noWrap classes={{ root: styles['time-label'] }}>
            {startDate.format('HH:mm')} - {endDate.format('HH:mm')}
          </Typography>
          <div className={styles['details-button']}>
            <Link href={`/doctor/${schedule.id}`}>
              <a className={styles['button-text']}>{textForKey('Details')}</a>
            </Link>
          </div>
        </Box>
      </div>
    );
  };

  return (
    <div className={styles['patients-list-root']}>
      {!isLoading && hours.length === 0 && (
        <Typography classes={{ root: styles['day-off-label'] }}>
          {textForKey("It's a day off")}
        </Typography>
      )}
      <TableContainer classes={{ root: styles['table-container'] }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {hours.map((item) => (
                <TableCell align='center' key={item}>
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {hours.map((item) => (
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
      id: PropTypes.number,
      patient: PropTypes.shape({
        id: PropTypes.number,
        phoneNumber: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        fullName: PropTypes.string,
      }),
      serviceName: PropTypes.string,
      serviceColor: PropTypes.string,
      start: PropTypes.object,
      end: PropTypes.object,
      scheduleStatus: PropTypes.string,
      isUrgent: PropTypes.bool,
    }),
  ),
};

PatientsList.defaultProps = {
  onPatientSelect: () => null,
  viewDate: new Date(),
};
