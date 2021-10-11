import React, { useEffect, useReducer } from "react";
import PropTypes from 'prop-types';
import { useRouter } from "next/router";
import moment from "moment-timezone";
import isEqual from "lodash/isEqual";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  deleteScheduleSelector,
  updateScheduleSelector
} from "../../../../redux/selectors/scheduleSelector";
import PatientsFilter from "../PatientsFilter";
import getCurrentWeek from "../../../utils/getCurrentWeek";
import { getSchedulesForInterval } from "../../../../middleware/api/schedules";
import usePrevious from "../../../utils/hooks/usePrevious";
import EasyCalendar from "../../common/EasyCalendar";
import DoctorsCalendarDay from "../DoctorsCalendarDay";
import { reducer, initialState, actions } from './DoctorCalendar.reducer';
import styles from './DoctorCalendar.module.scss';

const DoctorCalendar = (
  {
    currentUser,
    currentClinic,
    schedules: initialData,
    viewMode,
    date,
  }
) => {
  const updateSchedule = useSelector(updateScheduleSelector);
  const deleteSchedule = useSelector(deleteScheduleSelector);
  const viewDate = moment(date).toDate();
  const router = useRouter();
  const week = getCurrentWeek(viewDate);
  const previousDate = usePrevious(date);
  const [{ schedules, hours, filterData, isLoading }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (previousDate !== date) {
      handleFetchSchedules();
    }
  }, [date, previousDate]);

  useEffect(() => {
    if (isEqual(filterData, initialState.filterData)) {
      localDispatch(actions.setData(initialData));
      return;
    }

    const { schedules: initialSchedules } = initialData;
    const filteredSchedules = initialSchedules.map((item) => {
      const itemSchedules = item.schedules.filter((schedule) => {
        return (
          (filterData.patientName.length === 0 ||
            schedule.patient?.fullName.toLowerCase().startsWith(filterData.patientName)) &&
          (filterData.serviceId === -1 ||
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
  }, [filterData, initialData]);

  useEffect(() => {
    handleScheduleUpdate();
  }, [updateSchedule]);

  useEffect(() => {
    handleScheduleDelete();
  }, [deleteSchedule]);

  const handleFetchSchedules = async () => {
    localDispatch(actions.setIsLoading(true));
    try {
      const firstDay = viewMode === 'week' ? week[0].toDate() : viewDate;
      const lastDay = viewMode === 'week' ? week[week.length - 1].toDate() : viewDate;
      const response = await getSchedulesForInterval(firstDay, lastDay, currentUser.id);
      localDispatch(actions.setData(response.data));
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        toast.error(data.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  }

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

  const handlePatientNameChange = (patientName) => {
    localDispatch(actions.updateFilter({ patientName }))
  };

  const handleServiceChange = (event) => {
    localDispatch(actions.updateFilter({ serviceId: event.target.value }));
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
    localDispatch(actions.updateFilter({ appointmentStatus: event.target.value }));
  };

  const handleDateChange = async (newDate, mode = viewMode) => {
    const stringDate = moment(newDate).format('YYYY-MM-DD')
    await router.replace(`/doctor?date=${stringDate}&viewMode=${mode}`);
  };

  const handleDateClick = async (column) => {
    const date = moment(column.id).toDate();
    await handleDateChange(date, 'day');
  }

  const mappedWeek = week.map((date) => {
    const dayId = moment(date).format('YYYY-MM-DD')
    const day = schedules.find(item => item.id === dayId)
    return {
      id: dayId,
      doctorId: currentUser.id,
      name: moment(date).format('DD dddd'),
      disabled: day?.holiday,
      date: date.toDate(),
    };
  });

  return (
    <div className={styles.doctorCalendarRoot}>
      <div className={styles.filterWrapper}>
        <PatientsFilter
          filterData={filterData}
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
        {isLoading && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar'/>
          </div>
        )}
        {viewMode === 'week' ? (
          <EasyCalendar
            showHourIndicator
            hideCreateIndicator
            dayHours={hours}
            columns={mappedWeek}
            schedules={schedules}
            viewDate={viewDate}
            animatedStatuses={['OnSite']}
            onScheduleSelected={handleScheduleSelected}
            onHeaderItemClick={handleDateClick}
          />
        ) : (
          <DoctorsCalendarDay
            currentUser={currentUser}
            viewDate={viewDate}
            schedules={{ hours, schedules }}
            onScheduleSelected={handleScheduleSelected}
          />
        )}
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
