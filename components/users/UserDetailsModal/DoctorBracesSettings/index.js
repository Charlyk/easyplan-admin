import React from 'react';

import clsx from 'clsx';
import { cloneDeep, remove } from 'lodash';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { clinicEnabledBracesSelector } from '../../../../redux/selectors/clinicSelector';
import DoctorServiceItem from '../DoctorServiceItem';
import styles from '../../../../styles/DoctorBracesSettings.module.scss';

const DoctorBracesSettings = ({ show, data, onChange, clinicBraces }) => {

  const handleServiceSelected = (service, price, percentage, isSelected) => {
    let newList = cloneDeep(data.braces);
    if (!isSelected) {
      remove(newList, item => item.serviceId === service.id);
      onChange(newList);
      console.log(newList);
      return;
    }

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
    onChange(newList);
    console.log(newList);
  };

  const sortedBraces = sortBy(clinicBraces, item => item.name);
  const classes = clsx(
    styles['doctor-braces-settings'],
    show ? styles.expanded : styles.collapsed,
  );
  return (
    <div className={classes} style={{ height: show ? 'unset' : 0 }}>
      {sortedBraces.map(service => (
        <DoctorServiceItem
          key={`${service.id}-service`}
          service={service}
          doctorService={data.braces.find(
            item => item.serviceId === service.id,
          )}
          onSelected={handleServiceSelected}
          selected={data.braces.some(item => item.serviceId === service.id)}
        />
      ))}
    </div>
  );
};

export default DoctorBracesSettings;

DoctorBracesSettings.propTypes = {
  show: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    braces: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        serviceId: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
  }),
  onChange: PropTypes.func,
};
