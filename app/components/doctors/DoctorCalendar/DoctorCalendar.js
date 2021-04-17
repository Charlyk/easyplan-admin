import React, { useEffect, useMemo, useState } from "react";
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
    date,
  }
) => {
  const viewDate = moment(date).toDate();
  const router = useRouter();
  const [filterData, setFilterData] = useState(initialFilter);
  const [week, setWeek] = useState(getCurrentWeek(viewDate));
  const mappedSchedules = useMemo(() => {
    const newSchedules = [];
    for (const key of Object.keys(initialSchedules)) {
      newSchedules.push({
        id: key,
        schedules: initialSchedules[key],
      });
    }
    return newSchedules;
  }, [initialSchedules]);
  const [schedules, setSchedules] = useState(mappedSchedules);

  useEffect(() => {
    const newWeek = getCurrentWeek(viewDate);
    if (!isEqual(newWeek, week)) {
      setWeek(getCurrentWeek(viewDate));
    }
  }, [viewDate]);

  useEffect(() => {
    if (isEqual(filterData, initialFilter)) {
      setSchedules(mappedSchedules);
      return;
    }

    const filteredSchedules = mappedSchedules.map((item) => {
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

  const handleAppointmentStatusChange = (event) => {
    setFilterData({
      ...filterData,
      appointmentStatus: event.target.value,
    });
  };

  const handleDateChange = async (newDate) => {
    const stringDate = moment(newDate).format('YYYY-MM-DD')
    await router.replace(`/doctor?date=${stringDate}`);
  };

  const mappedWeek = week.map((date) => {
    return {
      id: moment(date).format('YYYY-MM-DD'),
      doctorId: currentUser.id,
      name: moment(date).format('DD dddd'),
      disabled: false,
      date: date,
    };
  });

  return (
    <div className={styles.doctorCalendarRoot}>
      <div className={styles.filterWrapper}>
        <PatientsFilter
          currentClinic={currentClinic}
          selectedDate={viewDate}
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
