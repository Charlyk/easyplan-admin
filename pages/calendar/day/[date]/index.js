import React, { useContext } from "react";
import Main from "../../../../components/common/MainComponent";
import Calendar from '../../../../src/pages/Calendar';
import CalendarDayView from "../../../../src/pages/Calendar/AppointmentsCalendar/CalendarDayView";
import moment from "moment";
import { getDaySchedules } from '../../../../api/schedules';

const CalendarDayPage = ({ date, schedules, dayHours }) => {
  const viewDate = moment(date).toDate()
  return (
    <Main currentUser={authProvider.user} currentClinic={authProvider.clinic}>
      <Calendar currentUser={authProvider.user} viewDate={viewDate}>
        <CalendarDayView schedules={schedules} dayHours={dayHours} viewDate={viewDate}/>
      </Calendar>
    </Main>
  )
}

export const getServerSideProps = async ({ query, req }) => {
  const { date: queryDate } = query;
  const date = moment(queryDate).toDate();
  const response = await getDaySchedules(date, req);
  if (response.isError) {
    return {
      props: {
        date: queryDate,
        schedules: [],
        dayHours: [],
      }
    }
  }

  const { schedules, dayHours } = response.data;
  const schedulesMap = new Map();
  schedules?.forEach((item) => {
    schedulesMap.set(item.doctorId, item.schedules);
  });
  return {
    props: {
      date: queryDate,
      schedules,
      dayHours,
    }
  }
}

export default CalendarDayPage;
