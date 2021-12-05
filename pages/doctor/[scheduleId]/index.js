import React from 'react';
import { connect } from 'react-redux';
import DoctorPatientDetails from 'app/components/doctors/DoctorPatientDetails';
import DoctorsMain from 'app/components/doctors/DoctorsMain';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import redirectToUrl from 'app/utils/redirectToUrl';
import { fetchDoctorScheduleDetails } from 'middleware/api/schedules';
import {
  authTokenSelector,
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setScheduleDetailsData } from 'redux/slices/doctorScheduleDetailsSlice';
import { wrapper } from 'store';

const DoctorScheduleDetails = () => {
  return (
    <DoctorsMain>
      <DoctorPatientDetails />
    </DoctorsMain>
  );
};

export default connect((state) => state)(DoctorScheduleDetails);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      try {
        const appState = store.getState();
        const authToken = authTokenSelector(appState);
        const currentUser = currentUserSelector(appState);
        const currentClinic = currentClinicSelector(appState);
        if (!authToken || !authToken.match(JwtRegex)) {
          return {
            redirect: {
              destination: '/login',
              permanent: true,
            },
          };
        }

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
        const response = await fetchDoctorScheduleDetails(
          scheduleId,
          null,
          req.headers,
        );
        store.dispatch(
          setScheduleDetailsData({ schedule: response.data, scheduleId }),
        );
        return {
          props: {},
        };
      } catch (error) {
        return handleRequestError(error);
      }
    },
);
