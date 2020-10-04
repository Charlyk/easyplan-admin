import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import { remove, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import dataAPI from '../../utils/api/dataAPI';
import SwitchButton from '../SwitchButton';

const Service = props => {
  const { service, selected, onSelected, doctorService } = props;
  const [price, setPrice] = useState('');
  const [percentage, setPercentage] = useState('');

  useEffect(() => {
    if (doctorService?.price) {
      setPrice(String(doctorService.price));
    }

    if (doctorService?.percentage) {
      setPercentage(String(doctorService.percentage));
    }
  }, [doctorService]);

  const handleServiceToggle = () => {
    onSelected(service, null, null, !selected);
  };

  const handlePercentageChange = event => {
    setPercentage(event.target.value);
    setPrice('');
    onSelected(service, null, parseInt(event.target.value), selected);
  };

  const handlePriceChange = event => {
    setPrice(event.target.value);
    setPercentage('');
    onSelected(service, parseFloat(event.target.value), null, selected);
  };

  const titleClasses = clsx('service-title', selected ? 'selected' : 'default');

  return (
    <div className='doctor-services__service'>
      <SwitchButton isChecked={selected} onChange={handleServiceToggle} />
      <div className={titleClasses}>{service.name}</div>
      <div className='doctor-services__service__fields'>
        <InputGroup>
          <Form.Control
            disabled={!selected || price.length > 0}
            className='doctor-services__service__field'
            min='0'
            placeholder='%'
            type='number'
            value={percentage}
            onChange={handlePercentageChange}
          />
          <InputGroup.Append>
            <InputGroup.Text id='basic-addon1'>%</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <InputGroup>
          <Form.Control
            disabled={!selected || percentage.length > 0}
            className='doctor-services__service__field'
            min='0'
            type='number'
            placeholder='$'
            value={price}
            onChange={handlePriceChange}
          />
          <InputGroup.Append>
            <InputGroup.Text id='basic-addon1'>mdl</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </div>
    </div>
  );
};

const DoctorServices = props => {
  const { show, data, onChange } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (services.length === 0 && !isLoading) {
      fetchServices();
    }
  }, [services]);

  const fetchServices = () => {
    setIsLoading(true);
    dataAPI
      .fetchServices(null)
      .then(response => {
        if (response.isError) {
          console.error(response.message);
        } else {
          setServices(response.data);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const handleServiceSelected = (service, price, percentage, isSelected) => {
    let newList = cloneDeep(data.services);
    if (isSelected) {
      if (newList.some(item => item.id === service.id)) {
        newList = newList.map(item => {
          if (item.id !== service.id) return item;
          return {
            id: service.id,
            price,
            percentage,
          };
        });
      } else {
        newList.push({
          id: service.id,
          price,
          percentage,
        });
      }
    } else {
      remove(newList, item => item.id === service.id);
    }
    onChange(newList);
  };

  const classes = clsx('doctor-components', show ? 'expanded' : 'collapsed');
  return (
    <div
      className={classes}
      style={{ height: show ? 48 * services.length : 0 }}
    >
      {services.map(service => (
        <Service
          key={service.id}
          service={service}
          doctorService={data.services.find(item => item.id === service.id)}
          onSelected={handleServiceSelected}
          selected={data.services.some(item => item.id === service.id)}
        />
      ))}
    </div>
  );
};

export default DoctorServices;

Service.propTypes = {
  selected: PropTypes.bool,
  onSelected: PropTypes.func,
  doctorService: PropTypes.shape({
    id: PropTypes.string,
    price: PropTypes.number,
    percentage: PropTypes.number,
  }),
  service: PropTypes.shape({
    categoryId: PropTypes.string,
    color: PropTypes.string,
    description: PropTypes.string,
    duration: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
  }),
};

DoctorServices.propTypes = {
  show: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    avatarFile: PropTypes.object,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        price: PropTypes.number,
        percentage: PropTypes.number,
      }),
    ),
  }),
  onChange: PropTypes.func,
};
