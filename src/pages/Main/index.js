import React, { useEffect, useState } from 'react';

import './styles.scss';

import { useLocation } from 'react-router-dom';

import MainMenu from '../../components/MainMenu';

const Main = props => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <div className='main-page'>
      <MainMenu currentPath={currentPath} />
    </div>
  );
};

export default Main;
