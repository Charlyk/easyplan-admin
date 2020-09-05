import React, { useEffect, useState } from 'react';

import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
import './styles.scss';
import { Button } from 'react-bootstrap';

import IconPlus from '../../assets/icons/iconPlus';
import { textForKey } from '../../utils/localization';
import LeftSideModal from '../LeftSideModal';
import ServiceItem from './ServiceItem';

const Services = props => {
  const { category } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  }, [category]);

  if (category == null) return null;

  const renderSkeleton = () => {
    return (
      <div className='services-root__services-skeleton'>
        <div className='services-root__services-skeleton__skeleton'>
          <Skeleton variant='rect' animation='wave' />
        </div>
        <div className='services-root__services-skeleton__skeleton'>
          <Skeleton variant='rect' animation='wave' />
        </div>
        <div className='services-root__services-skeleton__skeleton'>
          <Skeleton variant='rect' animation='wave' />
        </div>
        <div className='services-root__services-skeleton__skeleton'>
          <Skeleton variant='rect' animation='wave' />
        </div>
        <div className='services-root__services-skeleton__skeleton'>
          <Skeleton variant='rect' animation='wave' />
        </div>
        <div className='services-root__services-skeleton__skeleton'>
          <Skeleton variant='rect' animation='wave' />
        </div>
        <div className='services-root__services-skeleton__skeleton'>
          <Skeleton variant='rect' animation='wave' />
        </div>
        <div className='services-root__services-skeleton__skeleton'>
          <Skeleton variant='rect' animation='wave' />
        </div>
      </div>
    );
  };

  const toggleAddService = () => {
    setIsAddingService(!isAddingService);
  };

  return (
    <div className='services-root'>
      <LeftSideModal show={isAddingService} onClose={toggleAddService} />
      <div className='services-root__header'>
        <div className='services-root__title'>{textForKey('Services')}</div>
        <Button className='add-service-btn' onClick={toggleAddService}>
          {textForKey('Add service')}
          <IconPlus />
        </Button>
      </div>
      <div className='services-root__services'>
        {isLoading && renderSkeleton()}
        <ServiceItem />
        <ServiceItem />
        <ServiceItem />
        <ServiceItem />
      </div>
    </div>
  );
};

export default Services;

Services.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    servicesCount: PropTypes.number,
  }),
};
