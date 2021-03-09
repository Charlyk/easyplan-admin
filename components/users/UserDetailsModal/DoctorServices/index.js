import React from 'react';

import clsx from 'clsx';
import { remove, cloneDeep } from 'lodash';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { clinicServicesSelector } from '../../../../redux/selectors/clinicSelector';
import DoctorServiceItem from '../DoctorServiceItem';
import styles from '../../../../styles/DoctorServices.module.scss';

const DoctorServices = ({ show, data, onChange, clinicServices }) => {

  const handleServiceSelected = (service, price, percentage, isSelected) => {
    let newList = cloneDeep(data.services);
    if (isSelected) {
      if (newList.some(item => item.serviceId === service.id)) {
        newList = newList.map(item => {
          if (item.serviceId !== service.id) return item;
          return {
            serviceId: service.id,
            price,
            percentage,
          };
        });
      } else {
        newList.push({
          serviceId: service.id,
          price,
          percentage,
        });
      }
    } else {
      remove(newList, item => item.serviceId === service.id);
    }
    onChange(newList);
  };

  const sortedServices = sortBy(clinicServices, item => item.name);
  const classes = clsx(styles['doctor-services'], show ? styles.expanded : styles.collapsed);
  return (
    <div className={classes} style={{ height: show ? 'unset' : 0 }}>
      {sortedServices.map(service => (
        <DoctorServiceItem
          key={`${service.id}-service`}
          service={service}
          doctorService={data.services.find(
            item => item.serviceId === service.id,
          )}
          onSelected={handleServiceSelected}
          selected={data.services.some(item => item.serviceId === service.id)}
        />
      ))}
    </div>
  );
};

export default DoctorServices;

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
        serviceId: PropTypes.number,
        id: PropTypes.number,
        price: PropTypes.number,
        percentage: PropTypes.number,
      }),
    ),
  }),
  onChange: PropTypes.func,
};
