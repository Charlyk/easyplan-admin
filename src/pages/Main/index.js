import React, { useEffect, useState } from 'react';

import './styles.scss';

import { useLocation, Switch, Route } from 'react-router-dom';

import MainMenu from '../../components/MainMenu';
import PageHeader from '../../components/PageHeader';
import paths from '../../utils/paths';
import Categories from '../Categories';

const Main = props => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  const getPageTitle = () => {
    return paths[currentPath];
  };

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <div className='main-page'>
      <MainMenu currentPath={currentPath} />
      <div className='data-container'>
        <PageHeader title={getPageTitle()} />
        <div className='data'>
          <Switch>
            <Route path='/categories' component={Categories} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Main;
