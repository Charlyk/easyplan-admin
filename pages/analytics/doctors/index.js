import React, { useEffect, useReducer, useRef } from 'react';

import sum from 'lodash/sum';
import moment from 'moment-timezone';
import { Form } from 'react-bootstrap';

import EasyDateRangePicker from '../../../components/common/EasyDateRangePicker';
import {
  generateReducerActions,
  handleRequestError, redirectToUrl, redirectUserTo,
} from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import StatisticFilter from '../../../app/components/dashboard/analytics/StatisticFilter';
import { Role } from "../../../app/utils/constants";
import MainComponent from "../../../components/common/MainComponent";
import sortBy from "lodash/sortBy";
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@material-ui/core";
import { useRouter } from "next/router";
import isEqual from "lodash/isEqual";
import { getDoctorsStatistics } from "../../../middleware/api/analytics";
import styles from '../../../app/components/dashboard/analytics/ServicesAnalytics/ServicesAnalytics.module.scss';
import { fetchAppData } from "../../../middleware/api/initialization";
import { parseCookies } from "../../../utils";
import DoctorsAnalytics from "../../../app/components/dashboard/analytics/DoctorsAnalytics";

const Doctors = ({ currentUser, currentClinic, statistics, query: initialQuery, authToken }) => {

  return (
    <MainComponent
      currentUser={currentUser}
      currentClinic={currentClinic}
      currentPath='/analytics/doctors'
      authToken={authToken}
    >
      <DoctorsAnalytics
        currentClinic={currentClinic}
        query={initialQuery}
        statistics={statistics}
      />
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
  try {
    if (query.fromDate == null) {
      query.fromDate = moment().startOf('month').format('YYYY-MM-DD');
    }
    if (query.toDate == null) {
      query.toDate = moment().endOf('month').format('YYYY-MM-DD');
    }
    if (query.doctorId == null) {
      query.doctorId = -1;
    }
    if (query.serviceId == null) {
      query.serviceId = -1;
    }
    const { auth_token: authToken } = parseCookies(req);
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/analytics/doctors');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const { data: statistics } = await getDoctorsStatistics(query, req.headers);
    return {
      props: {
        authToken,
        statistics,
        query,
        ...appData,
      },
    };
  } catch (error) {
    await handleRequestError(error, req, res);
    return {
      props: {
        statistics: [],
        query: {},
      }
    };
  }
}

export default Doctors;
