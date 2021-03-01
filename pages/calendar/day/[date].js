import React, { useEffect } from "react";
import Main from "../../../src/pages/Main";
import Calendar from '../../../src/pages/Calendar';
import CalendarDayView from "../../../src/pages/Calendar/AppointmentsCalendar/CalendarDayView";
import moment from "moment";
import { getDaySchedules } from '../../../api/schedules';
import { parseCookies } from "../../../api/utils";
import { useSelector } from "react-redux";
import { userSelector } from "../../../src/redux/selectors/rootSelector";

const CalendarDayPage = ({ date, schedules, dayHours, selectedClinicId }) => {
  const currentUser = useSelector(userSelector);
  const selectedClinic = currentUser?.clinics.find(item => item.clinicId === selectedClinicId)
    || currentUser?.clinics[0];

  useEffect(() => {

  }, [date]);

  if (currentUser == null) {
    return null;
  }



  const viewDate = moment(date).toDate()
  return (
    <Main currentUser={currentUser} selectedClinicId={selectedClinic?.clinicId}>
      <Calendar currentUser={currentUser} viewDate={viewDate}>
        <CalendarDayView schedules={schedules} dayHours={dayHours} viewDate={viewDate}/>
      </Calendar>
    </Main>
  )
}

CalendarDayPage.getInitialProps = async ({ query, req }) => {
  const { auth_token, clinic_id } = parseCookies(req);
  const headers = {
    'Authorization': auth_token,
    'X-EasyPlan-Clinic-Id': clinic_id
  }
  const { date: queryDate } = query;
  const date = moment(queryDate).toDate();
  const response = await getDaySchedules(date, headers);
  if (response.isError) {
    return {
      selectedClinicId: clinic_id,
      date: queryDate,
      schedules: [],
      dayHours: [],
    }
  }

  const { schedules, dayHours } = response.data;
  const schedulesMap = new Map();
  schedules?.forEach((item) => {
    schedulesMap.set(item.doctorId, item.schedules);
  });
  return {
    selectedClinicId: clinic_id,
    date: queryDate,
    schedules,
    dayHours,
  }
}

export default CalendarDayPage;
