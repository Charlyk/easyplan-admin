import React, { useEffect, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

import {
  deleteScheduleSelector,
  updateScheduleSelector,
} from '../../redux/selectors/scheduleSelector';
import PatientsFilter from '../../components/doctors/PatientsFilter';
import PatientsList from '../../components/doctors/PatientsList';
import styles from '../../styles/DoctorPatients.module.scss';
import DoctorsMain from "../../components/doctors/DoctorsMain";
import { wrapper } from "../../store";
import axios from "axios";
import { baseAppUrl } from "../../eas.config";
import { handleRequestError, redirectToUrl, redirectUserTo } from "../../utils/helperFuncs";
import { useRouter } from "next/router";
import { fetchAppData } from "../../middleware/api/initialization";

const initialFilter = {
  patientName: '',
  serviceId: 'all',
  appointmentStatus: 'all',
}

const DoctorPatients = ({ currentUser, currentClinic, schedules: initialSchedules, date }) => {
  const router = useRouter();
  const updateSchedule = useSelector(updateScheduleSelector);
  const deleteSchedule = useSelector(deleteScheduleSelector);
  const [schedules, setSchedules] = useState([]);
  const viewDate = moment(date).toDate();
  const [filterData, setFilterData] = useState(initialFilter);

  useEffect(() => {
    setSchedules(initialSchedules);
  }, [initialSchedules])

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
    if (isEqual(filterData, initialFilter)) {
      setSchedules(initialSchedules);
      return;
    }

    const filteredSchedules = initialSchedules.filter((schedule) => {
      return (
        (filterData.patientName.length === 0 ||
          schedule.patient.fullName.toLowerCase().startsWith(filterData.patientName)) &&
        (filterData.serviceId === 'all' ||
          schedule.serviceId === parseInt(filterData.serviceId)) &&
        (filterData.appointmentStatus === 'all' ||
          schedule.scheduleStatus === filterData.appointmentStatus)
      )
    });
    setSchedules(filteredSchedules);
  }, [filterData]);

  useEffect(() => {
    if (deleteSchedule == null) {
      return;
    }
    const newSchedules = schedules.filter((item) => item.id !== deleteSchedule.id);
    setSchedules(newSchedules);
  }, [deleteSchedule]);

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
    const stringDate = moment(newDate).format('YYYY-MM-DD')
    router.replace(`/doctor?date=${stringDate}`);
  };

  return (
    <DoctorsMain currentClinic={currentClinic} currentUser={currentUser}>
      <div className={styles['doctor-patients-root']}>
        <div className={styles['filter-wrapper']}>
          <PatientsFilter
            currentClinic={currentClinic}
            selectedDate={viewDate}
            onDateChange={handleDateChange}
            onNameChange={handlePatientNameChange}
            onServiceChange={handleServiceChange}
            onStatusChange={handleAppointmentStatusChange}
          />
        </div>
        <div className={styles['data-wrapper']}>
          <PatientsList
            filterData={filterData}
            viewDate={viewDate}
            schedules={schedules}
          />
        </div>
      </div>
    </DoctorsMain>
  );
};

export const getServerSideProps = async ({ res, req, query }) => {
  if (query.date == null) {
    query.date = moment().format('YYYY-MM-DD');
  }
  try {
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/doctor');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const queryString = new URLSearchParams(query).toString();
    const response = await axios.get(
      `${baseAppUrl}/api/schedules?${queryString}`,
      { headers: req.headers }
    );
    return {
      props: {
        schedules: response.data,
        date: query.date,
        ...appData,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        schedules: [],
        date: query.date,
      },
    };
  }
}

export default wrapper.withRedux(DoctorPatients);
