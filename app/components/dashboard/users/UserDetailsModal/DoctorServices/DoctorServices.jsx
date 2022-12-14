import React from 'react';
import clsx from 'clsx';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { clinicCurrencySelector } from 'redux/selectors/appDataSelector';
import DoctorServiceItem from '../DoctorServiceItem';
import styles from './DoctorServices.module.scss';

const DoctorServices = ({ show, data, onChange, clinicServices }) => {
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const handleServiceSelected = (service, price, percentage, isSelected) => {
    let newList = cloneDeep(data.services);
    if (isSelected) {
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
    } else {
      remove(newList, (item) => item.serviceId === service.id);
    }
    onChange(newList);
  };

  const sortedServices = sortBy(clinicServices, (item) => item.name);
  const classes = clsx(styles.doctorServices);
  return (
    <div className={classes} style={{ height: show ? 'unset' : 0 }}>
      {sortedServices.map((service) => (
        <DoctorServiceItem
          key={`${service.id}-service`}
          service={service}
          doctorService={data.services.find(
            (item) => item.serviceId === service.id,
          )}
          clinicCurrency={clinicCurrency}
          onSelected={handleServiceSelected}
          selected={data.services.some((item) => item.serviceId === service.id)}
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
