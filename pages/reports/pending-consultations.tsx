import React from 'react';
import moment from 'moment-timezone';
import { NextPage } from 'next';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import MainComponent from 'app/components/common/MainComponent';
import { default as PendingConsultationsComponent } from 'app/components/dashboard/reports/PendingConsultations';
import { JwtRegex } from 'app/utils/constants';
import handleRequestError from 'app/utils/handleRequestError';
import parseCookies from 'app/utils/parseCookies';
import redirectToUrl from 'app/utils/redirectToUrl';
import { loginUrl } from 'eas.config';
import {
  currentClinicSelector,
  currentUserSelector,
} from 'redux/selectors/appDataSelector';
import { setCookies } from 'redux/slices/appDataSlice';
import { ReduxState } from 'redux/types';
import { wrapper } from 'store';
import { PaymentReportResponse } from 'types/api/response/paymentReport.types';

interface PendingConsultationsPageProps {
  payments: PaymentReportResponse;
  query: {
    page: number;
    itemsPerPage: number;
    startDate: string;
    endDate: string;
  };
}

const PendingConsultations: NextPage<PendingConsultationsPageProps> = ({
  query,
}) => {
  return (
    <MainComponent currentPath='/reports/pending-consultations'>
      <PendingConsultationsComponent query={query} />
    </MainComponent>
  );
};

export default connect((state: ReduxState) => state)(PendingConsultations);

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - ignore because of some weird type errors
  async ({ query, req }) => {
    try {
      // end the saga
      store.dispatch(END);
      await store.sagaTask.toPromise();

      const { auth_token: authToken } = parseCookies(req);
      const cookies = req?.headers?.cookie ?? '';
      store.dispatch(setCookies(cookies));

      if (!authToken || !authToken.match(JwtRegex)) {
        return {
          redirect: {
            destination: loginUrl,
            permanent: false,
          },
        };
      }

      // fetch page data
      const appState = store.getState();
      const currentUser = currentUserSelector(appState);
      const currentClinic = currentClinicSelector(appState);

      const redirectTo = redirectToUrl(
        currentUser,
        currentClinic,
        '/reports/pending-consultations',
      );
      if (redirectTo != null) {
        return {
          redirect: {
            destination: redirectTo,
            permanent: false,
          },
        };
      }

      if (query.startDate == null) {
        query.startDate = moment().startOf('week').format('YYYY-MM-DD');
      }

      if (query.endDate == null) {
        query.endDate = moment().endOf('week').format('YYYY-MM-DD');
      }

      if (query.page == null) {
        query.page = '0';
      }

      if (query.itemsPerPage == null) {
        query.itemsPerPage = '25';
      }

      return {
        props: {
          query,
        },
      };
    } catch (error) {
      return handleRequestError(error);
    }
  },
);
