import React from "react";
import moment from "moment-timezone";
import { SWRConfig } from "swr";
import CalendarContainer from "../../../app/components/dashboard/calendar/CalendarContainer";
import CalendarMonthView from "../../../app/components/dashboard/calendar/CalendarMonthView";
import handleRequestError from '../../../utils/handleRequestError';
import redirectToUrl from '../../../utils/redirectToUrl';
import redirectUserTo from '../../../utils/redirectUserTo';
import { fetchAppData } from "../../../middleware/api/initialization";
import { APP_DATA_API, JwtRegex, Role } from "../../../app/utils/constants";
import parseCookies from "../../../utils/parseCookies";

const Month = ({ fallback, doctorId, date, doctors, authToken }) => {
  const viewDate = moment(date).toDate();
  return (
    <SWRConfig value={{ fallback }}>
      <CalendarContainer
        doctors={doctors}
        doctorId={doctorId}
        date={viewDate}
        viewMode='month'
        authToken={authToken}
      >
        <CalendarMonthView
          doctorId={doctorId}
          viewDate={viewDate}
        />
      </CalendarContainer>
    </SWRConfig>
  )
};

export default Month;

export const getServerSideProps = async ({ req, res, query }) => {
  if (query.date == null) {
    query.date = moment().format('YYYY-MM-DD');
  }
  try {
    const { auth_token: authToken } = parseCookies(req);
    if (!authToken || !authToken.match(JwtRegex)) {
      return {
        redirect: {
          destination: '/login',
          permanent: true,
        },
      };
    }

    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData.data;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/calendar/month');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return {
        props: {
          fallback: {
            [APP_DATA_API]: {
              ...appData.data
            }
          },
        }
      };
    }
    // filter clinic doctors
    const doctors = currentClinic?.users?.filter((item) =>
      item.roleInClinic === Role.doctor && !item.isHidden
    ) || [];

    // check if doctor id is present in query
    let doctorId = query.doctorId;
    if (doctorId == null) {
      doctorId = doctors[0].id ?? 0;
    }

    return {
      props: {
        doctors,
        doctorId: parseInt(doctorId),
        date: query.date,
        authToken,
        fallback: {
          [APP_DATA_API]: {
            ...appData.data
          }
        },
      }
    }
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        date: query.date
      }
    }
  }
};
