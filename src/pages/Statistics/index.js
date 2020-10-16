import React, { useEffect, useState } from 'react';

import './styles.scss';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import {
  setClinicDoctors,
  setClinicServices,
} from '../../redux/actions/clinicActions';
import dataAPI from '../../utils/api/dataAPI';
import ActivityLogs from './components/activityLogs/ActivityLogs';
import DoctorsStatistics from './components/doctors/DoctorsStatistics';
import GeneralStatistics from './components/general/GeneralStatistics';
import ServicesStatistics from './components/services/ServicesStatistics';

const Statistics = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    // fetch clinic doctors
    const doctorsResponse = await dataAPI.getClinicDoctors();
    if (!doctorsResponse.isError) {
      dispatch(setClinicDoctors(doctorsResponse.data));
    }

    // fetch clinic services
    const servicesResponse = await dataAPI.fetchServices(null);
    if (!servicesResponse.isError) {
      dispatch(setClinicServices(servicesResponse.data));
    }
  };

  return (
    <div className='statistics-root' id='statistics-root'>
      <Switch>
        <Route path='/analytics/general' component={GeneralStatistics} />
        <Route path='/analytics/services' component={ServicesStatistics} />
        <Route path='/analytics/activity-logs' component={ActivityLogs} />
        <Route path='/analytics/doctors' component={DoctorsStatistics} />
      </Switch>
    </div>
  );
};

export default Statistics;
