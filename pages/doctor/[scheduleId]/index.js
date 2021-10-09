import React from 'react';
import { SWRConfig } from "swr";
import redirectToUrl from '../../../app/utils/redirectToUrl';
import DoctorsMain from "../../../app/components/doctors/DoctorsMain";
import { fetchAppData } from "../../../middleware/api/initialization";
import { fetchDoctorScheduleDetails } from "../../../middleware/api/schedules";
import parseCookies from "../../../app/utils/parseCookies";
import DoctorPatientDetails from "../../../app/components/doctors/DoctorPatientDetails";
import { APP_DATA_API, JwtRegex } from "../../../app/utils/constants";
import handleRequestError from "../../../app/utils/handleRequestError";

const DoctorScheduleDetails = (
  {
    fallback,
    schedule: initialSchedule,
    scheduleId,
    authToken,
  }
) => {
  return (
    <SWRConfig value={{ fallback }}>
      <DoctorsMain
        authToken={authToken}
        pageTitle={initialSchedule?.patient?.fullName}
      >
        <DoctorPatientDetails
          schedule={initialSchedule}
          scheduleId={scheduleId}
          authToken={authToken}
        />
      </DoctorsMain>
    </SWRConfig>
  );
};

export const getServerSideProps = async ({ req, query }) => {
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
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/doctor');
    if (redirectTo != null) {
      return {
        redirect: {
          destination: redirectTo,
          permanent: true,
        },
      };
    }

    const { scheduleId } = query;
    const response = await fetchDoctorScheduleDetails(scheduleId, null, req.headers);
    return {
      props: {
        scheduleId,
        authToken,
        schedule: response.data,
        fallback: {
          [APP_DATA_API]: {
            ...appData.data
          }
        },
      },
    };
  } catch (error) {
    return handleRequestError(error);
  }
}

export default DoctorScheduleDetails;
