import React from 'react';

import './styles.scss';
import { Route, Switch } from 'react-router-dom';

import ServicesStatistics from './components/services/ServicesStatistics';

const Statistics = props => {
  return (
    <div className='statistics-root'>
      <Switch>
        <Route path='/analytics/services' component={ServicesStatistics} />
      </Switch>
    </div>
  );
};

export default Statistics;
