import React, { useEffect, useRef, useState } from 'react';

import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
import './Services.module.scss';
import { Button } from 'react-bootstrap';

import IconPlus from '../../../components/icons/iconPlus';
import dataAPI from '../../../utils/api/dataAPI';
import { textForKey } from '../../../utils/localization';
import ServiceDetailsModal from '../../../components/ServiceDetailsModal';
import ServiceItem from './ServiceItem';

const Services = props => {
  const serviceToEdit = useRef(null);
  const { category } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (category != null && !isLoading) {
      serviceToEdit.current = null;
      fetchServices();
    }
  }, [category]);

  const fetchServices = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchServices(category?.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      setServices(response.data);
    }
    setIsLoading(false);
  };

  if (category == null) return null;

  const renderSkeleton = () => {
    const skeletons = [];
    for (let i = 0; i < category.servicesCount; i++) {
      skeletons.push(
        <div className='services-root__services-skeleton__skeleton' key={i}>
          <Skeleton variant='rect' animation='wave' />
        </div>,
      );
    }
    return <div className='services-root__services-skeleton'>{skeletons}</div>;
  };

  const toggleAddService = () => {
    serviceToEdit.current = null;
    setIsAddingService(!isAddingService);
    fetchServices();
  };

  const handleServiceEdit = service => {
    serviceToEdit.current = service;
    setIsAddingService(true);
  };

  return (
    <div className='services-root'>
      <ServiceDetailsModal
        service={serviceToEdit.current}
        category={category}
        show={isAddingService}
        onClose={toggleAddService}
      />
      <div className='services-root__header'>
        <div className='services-root__title'>{textForKey('Services')}</div>
        <Button className='positive-button' onClick={toggleAddService}>
          {textForKey('Add service')}
          <IconPlus />
        </Button>
      </div>
      <div className='services-root__services'>
        {isLoading && services?.length === 0 && renderSkeleton()}
        {services &&
          services.map(service => (
            <ServiceItem
              onEdit={handleServiceEdit}
              key={service.id}
              service={service}
            />
          ))}
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
