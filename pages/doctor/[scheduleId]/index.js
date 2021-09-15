import React from 'react';
import handleRequestError from '../../../utils/handleRequestError';
import redirectToUrl from '../../../utils/redirectToUrl';
import redirectUserTo from '../../../utils/redirectUserTo';
import DoctorsMain from "../../../app/components/doctors/DoctorsMain";
import { fetchAppData } from "../../../middleware/api/initialization";
import { fetchDoctorScheduleDetails } from "../../../middleware/api/schedules";
import { parseCookies } from "../../../utils";
import DoctorPatientDetails from "../../../app/components/doctors/DoctorPatientDetails";

const DoctorScheduleDetails = (
  {
    currentUser,
    currentClinic,
    schedule: initialSchedule,
    scheduleId,
    authToken,
  }
) => {
  return (
    <DoctorsMain
      currentClinic={currentClinic}
      currentUser={currentUser}
      authToken={authToken}
      pageTitle={initialSchedule?.patient?.fullName}
    >
      <DoctorPatientDetails
        currentUser={currentUser}
        currentClinic={currentClinic}
        schedule={initialSchedule}
        scheduleId={scheduleId}
        authToken={authToken}
      />
    </DoctorsMain>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
  try {
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData.data;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/doctor');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData.data } };
    }

    const { scheduleId } = query;
    const response = await fetchDoctorScheduleDetails(scheduleId, null, req.headers);
    return {
      props: {
        scheduleId,
        authToken,
        schedule: response.data,
        ...appData.data,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {}
    }
  }
}

export default DoctorScheduleDetails;
