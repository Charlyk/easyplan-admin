import React, { useEffect, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import moment from 'moment-timezone';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { userSelector } from '../../redux/selectors/rootSelector';
import {
  deleteScheduleSelector,
  updateScheduleSelector,
} from '../../redux/selectors/scheduleSelector';
import dataAPI from '../../utils/api/dataAPI';
import PatientsFilter from './components/patients/PatientsFilter';
import PatientsList from './components/patients/PatientsList';
import './styles.scss';

const DoctorPatients = () => {
  const updateSchedule = useSelector(updateScheduleSelector);
  const deleteSchedule = useSelector(deleteScheduleSelector);
  const currentUser = useSelector(userSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [filterData, setFilterData] = useState({
    patientName: '',
    serviceId: 'all',
    appointmentStatus: 'all',
  });

  useEffect(() => {
    setIsLoading(true);
    fetchPatients();
  }, [viewDate]);

  useEffect(() => {
    if (updateSchedule != null) {
      const scheduleExists = schedules.some(
        (item) =>
          item.id === updateSchedule.id && item.doctorId === currentUser.id,
      );
      const newSchedules = scheduleExists
        ? schedules.map((item) => {
            if (item.id !== updateSchedule.id) {
              return item;
            }

            return updateSchedule;
          })
        : cloneDeep(schedules);
      if (!scheduleExists && updateSchedule.doctorId === currentUser.id) {
        const currentDay = moment(viewDate);
        const scheduleDay = moment(updateSchedule.startTime);
        if (currentDay.isSame(scheduleDay, 'days')) {
          newSchedules.push(updateSchedule);
        }
      }
      setSchedules(newSchedules);
    }
  }, [updateSchedule]);

  useEffect(() => {
    if (deleteSchedule == null) {
      return;
    }
    const newSchedules = cloneDeep(schedules);
    remove(newSchedules, (item) => item.id === deleteSchedule.id);
    setSchedules(newSchedules);
  }, [deleteSchedule]);

  const fetchPatients = async () => {
    const response = await dataAPI.fetchSchedules(currentUser.id, viewDate);
    if (response.isError) {
      toast.error(response.message);
    } else {
      setSchedules(response.data);
    }
    setIsLoading(false);
  };

  const handlePatientNameChange = (event) => {
    setFilterData({
      ...filterData,
      patientName: event.target.value,
    });
  };

  const handleServiceChange = (event) => {
    setFilterData({
      ...filterData,
      serviceId: event.target.value,
    });
  };

  const handleAppointmentStatusChange = (event) => {
    setFilterData({
      ...filterData,
      appointmentStatus: event.target.value,
    });
  };

  const handleDateChange = (newDate) => {
    setViewDate(newDate);
  };

  return (
    <div className='doctor-patients-root'>
      <div className='filter-wrapper'>
        <PatientsFilter
          selectedDate={viewDate}
          onDateChange={handleDateChange}
          onNameChange={handlePatientNameChange}
          onServiceChange={handleServiceChange}
          onStatusChange={handleAppointmentStatusChange}
        />
      </div>
      <div className='data-wrapper'>
        {isLoading && (
          <Spinner animation='border' className='loading-spinner' />
        )}
        <PatientsList
          filterData={filterData}
          viewDate={viewDate}
          schedules={schedules}
        />
      </div>
    </div>
  );
};

export default DoctorPatients;
