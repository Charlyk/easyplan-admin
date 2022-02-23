import React from 'react';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
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
import { setCookies } from 'redux/slices/appDataSlice';
import { setScheduleDetailsData } from 'redux/slices/doctorScheduleDetailsSlice';
import { wrapper } from 'store';
import { loginUrl } from '../../../eas.config';

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
        // end the saga
        store.dispatch(END);
        await store.sagaTask.toPromise();

        // fetch page data
        const appState = store.getState();
        const authToken = authTokenSelector(appState);
        const currentUser = currentUserSelector(appState);
        const currentClinic = currentClinicSelector(appState);
        const cookies = req?.headers?.cookie ?? '';
        store.dispatch(setCookies(cookies));
        if (!authToken || !authToken.match(JwtRegex)) {
          return {
            redirect: {
              destination: loginUrl,
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
