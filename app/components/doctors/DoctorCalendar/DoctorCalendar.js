import React, { useEffect, useReducer } from "react";
import PropTypes from 'prop-types';
import { useRouter } from "next/router";
import moment from "moment-timezone";
import isEqual from "lodash/isEqual";
import PatientsFilter from "../../../../components/doctors/PatientsFilter";
import { getCurrentWeek } from "../../../../utils/helperFuncs";
import EasyCalendar from "../../common/EasyCalendar";
import { reducer, initialState, actions } from './DoctorCalendar.reducer';
import styles from './DoctorCalendar.module.scss';
import { useSelector } from "react-redux";
import { deleteScheduleSelector, updateScheduleSelector } from "../../../../redux/selectors/scheduleSelector";

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
  const updateSchedule = useSelector(updateScheduleSelector);
  const deleteSchedule = useSelector(deleteScheduleSelector);
  const viewDate = moment(date).toDate();
  const router = useRouter();
  const week= getCurrentWeek(viewDate);
  const [{ schedules, filterData }, localDispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    localDispatch(actions.setSchedules(initialSchedules));
  }, [initialSchedules]);

  useEffect(() => {
    if (isEqual(filterData, initialState.filterData)) {
      localDispatch(actions.setSchedules(initialSchedules));
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
    localDispatch(actions.setSchedules(filteredSchedules));
  }, [filterData]);

  useEffect(() => {
    handleScheduleUpdate();
  }, [updateSchedule]);

  useEffect(() => {
    handleScheduleDelete();
  }, [deleteSchedule])

  function handleScheduleDelete() {
    if (deleteSchedule == null) {
      return;
    }

    localDispatch(actions.deleteSchedule(deleteSchedule))
  }

  async function handleScheduleUpdate() {
    if (updateSchedule == null) {
      return;
    }
    const scheduleDate = moment(updateSchedule.startTime);

    if (updateSchedule.doctorId !== currentUser.id) {
      return;
    }

    const formattedDate = scheduleDate.format('YYYY-MM-DD');
    const scheduleExists = schedules.some((item) =>
      item.id === formattedDate &&
      item.schedules.some((schedule) => schedule.id === updateSchedule.id)
    );

    if (scheduleExists) {
      localDispatch(actions.updateSchedule(updateSchedule));
    } else {
      localDispatch(actions.addSchedule(updateSchedule));
    }
  }

  const handlePatientNameChange = (event) => {
    localDispatch(actions.setFilterData({
      ...filterData,
      patientName: event.target.value,
    }));
  };

  const handleServiceChange = (event) => {
    localDispatch(actions.setFilterData({
      ...filterData,
      serviceId: event.target.value,
    }));
  };

  const handleScheduleSelected = async (schedule) => {
    if (schedule.type !== 'Schedule') {
      return;
    }
    await router.push(`/doctor/${schedule.id}`);
  }

  const handleViewModeChange = async () => {
    const stringDate = moment(viewDate).format('YYYY-MM-DD');
    const newMode = viewMode === 'week' ? 'day' : 'week';
    const url = `/doctor?date=${stringDate}&viewMode=${newMode}`;
    await router.replace(url)
  }

  const handleAppointmentStatusChange = (event) => {
    localDispatch(actions.setFilterData({
      ...filterData,
      appointmentStatus: event.target.value,
    }));
  };

  const handleDateChange = async (newDate, mode = viewMode) => {
    const stringDate = moment(newDate).format('YYYY-MM-DD')
    await router.replace(`/doctor?date=${stringDate}&viewMode=${mode}`);
  };

  const handleDateClick = async (column) => {
    const date = moment(column.id).toDate();
    await handleDateChange(date, 'day');
  }

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
          onHeaderItemClick={handleDateClick}
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
