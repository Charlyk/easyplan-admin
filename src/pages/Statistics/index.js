import React from 'react';

import './styles.scss';
import { Route, Switch } from 'react-router-dom';

import ActivityLogs from './components/activityLogs/ActivityLogs';
import DoctorsStatistics from './components/doctors/DoctorsStatistics';
import GeneralStatistics from './components/general/GeneralStatistics';
import ServicesStatistics from './components/services/ServicesStatistics';

const Statistics = props => {
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