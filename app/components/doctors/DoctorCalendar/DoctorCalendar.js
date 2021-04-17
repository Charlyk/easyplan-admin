import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import PatientsFilter from "../../../../components/doctors/PatientsFilter";
import { useRouter } from "next/router";
import moment from "moment-timezone";
import isEqual from "lodash/isEqual";
import EasyCalendar from "../../common/EasyCalendar";
import { getCurrentWeek } from "../../../../utils/helperFuncs";
import styles from './DoctorCalendar.module.scss'

const initialFilter = {
  patientName: '',
  serviceId: 'all',
  appointmentStatus: 'all',
}

const DoctorCalendar = (
  {
    currentUser,
    currentClinic,
    schedules: {
      hours: dayHours,
      schedules: initialSchedules
    },
    viewMode,
    date,
  }
) => {
  const viewDate = moment(date).toDate();
  const router = useRouter();
  const [filterData, setFilterData] = useState(initialFilter);
  const [week, setWeek] = useState(getCurrentWeek(viewDate));
  const [schedules, setSchedules] = useState(initialSchedules);

  useEffect(() => {
    setSchedules(initialSchedules);
  }, [initialSchedules]);

  useEffect(() => {
    const newWeek = getCurrentWeek(viewDate);
    if (!isEqual(newWeek, week)) {
      setWeek(getCurrentWeek(viewDate));
    }
  }, [viewDate]);

  useEffect(() => {
    if (isEqual(filterData, initialFilter)) {
      setSchedules(initialSchedules);
      return;
    }

    const filteredSchedules = initialSchedules.map((item) => {
      const itemSchedules = item.schedules.filter((schedule) => {
        return (
          (filterData.patientName.length === 0 ||
            schedule.patient.fullName.toLowerCase().startsWith(filterData.patientName)) &&
          (filterData.serviceId === 'all' ||
            schedule.serviceId === parseInt(filterData.serviceId)) &&
          (filterData.appointmentStatus === 'all' ||
            schedule.scheduleStatus === filterData.appointmentStatus)
        )
      });
      return {
        ...item,
        schedules: itemSchedules
      }
    });
    setSchedules(filteredSchedules);
  }, [filterData]);

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

  const handleScheduleSelected = async (schedule) => {
    await router.push(`/doctor/${schedule.id}`);
  }

  const handleViewModeChange = async () => {
    const stringDate = moment(viewDate).format('YYYY-MM-DD');
    const newMode = viewMode === 'week' ? 'day' : 'week';
    const url = `/doctor?date=${stringDate}&viewMode=${newMode}`;
    await router.replace(url)
  }

  const handleAppointmentStatusChange = (event) => {
    setFilterData({
      ...filterData,
      appointmentStatus: event.target.value,
    });
  };

  const handleDateChange = async (newDate) => {
    const stringDate = moment(newDate).format('YYYY-MM-DD')
    await router.replace(`/doctor?date=${stringDate}&viewMode=${viewMode}`);
  };

  const mappedWeek = viewMode === 'week' ? (
    week.map((date) => {
      return {
        id: moment(date).format('YYYY-MM-DD'),
        doctorId: currentUser.id,
        name: moment(date).format('DD dddd'),
        disabled: false,
        date: date,
      };
    })
  ) : (
    [{
      id: moment(viewDate).format('YYYY-MM-DD'),
      doctorId: currentUser.id,
      name: moment(viewDate).format('DD MMMM YYYY'),
      disabled: false,
      date: viewDate,
    }]
  )

  return (
    <div className={styles.doctorCalendarRoot}>
      <div className={styles.filterWrapper}>
        <PatientsFilter
          viewMode={viewMode}
          currentClinic={currentClinic}
          selectedDate={viewDate}
          onViewModeChange={handleViewModeChange}
          onDateChange={handleDateChange}
          onNameChange={handlePatientNameChange}
          onServiceChange={handleServiceChange}
          onStatusChange={handleAppointmentStatusChange}
        />
      </div>
      <div className={styles.dataWrapper}>
        <EasyCalendar
          hideCreateIndicator
          dayHours={dayHours}
          columns={mappedWeek}
          schedules={schedules}
          viewDate={viewDate}
          animatedStatuses={['OnSite']}
          onScheduleSelected={handleScheduleSelected}
        />
      </div>
    </div>
  )
}

export default DoctorCalendar;

DoctorCalendar.propTypes = {
  currentUser: PropTypes.any,
  currentClinic: PropTypes.any,
  schedules: PropTypes.shape({
    hours: PropTypes.arrayOf(PropTypes.string),
    schedules: PropTypes.any
  }),
  viewMode: PropTypes.oneOf(['day', 'week']),
  date: PropTypes.string,
}
