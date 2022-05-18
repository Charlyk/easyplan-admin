import React from 'react';
import clsx from 'clsx';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { clinicCurrencySelector } from 'redux/selectors/appDataSelector';
import DoctorServiceItem from '../DoctorServiceItem';
import styles from './DoctorBracesSettings.module.scss';

const DoctorBracesSettings = ({ show, data, onChange, clinicBraces }) => {
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const handleServiceSelected = (service, price, percentage, isSelected) => {
    let newList = cloneDeep(data.braces);
    if (!isSelected) {
      remove(newList, (item) => item.serviceId === service.id);
      onChange(newList);
      return;
    }

    if (newList.some((item) => item.serviceId === service.id)) {
      newList = newList.map((item) => {
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
  };

  const sortedBraces = sortBy(clinicBraces, (item) => item.name);
  const classes = clsx(
    styles.doctorBracesSettings,
    show ? styles.expanded : styles.collapsed,
  );
  return (
    <div className={classes} style={{ height: show ? 'unset' : 0 }}>
      {sortedBraces.map((service) => (
        <DoctorServiceItem
          clinicCurrency={clinicCurrency}
          key={`${service.id}-service`}
          service={service}
          doctorService={data.braces.find(
            (item) => item.serviceId === service.id,
          )}
          onSelected={handleServiceSelected}
          selected={data.braces.some((item) => item.serviceId === service.id)}
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
