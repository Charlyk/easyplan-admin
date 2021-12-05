import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import EASTextField from 'app/components/common/EASTextField';
import SwitchButton from 'app/components/common/SwitchButton';
import styles from './ServiceDoctor.module.scss';

const ServiceDoctor = ({ serviceData, clinic, onChange }) => {
  const [doctorService, setDoctorService] = useState({
    selected: false,
    fullName: '',
    id: null,
    price: '',
    percentage: '',
  });

  useEffect(() => {
    if (serviceData != null) {
      setDoctorService({
        ...serviceData,
        price: serviceData.price ? String(serviceData.price) : '',
        percentage: serviceData.percentage
          ? String(serviceData.percentage)
          : '',
      });
    }
  }, [serviceData]);

  const handlePercentageChange = (newValue) => {
    onChange({
      ...doctorService,
      price: null,
      percentage: newValue,
    });
  };

  const handlePriceChanged = (newValue) => {
    onChange({
      ...doctorService,
      price: parseFloat(newValue),
      percentage: null,
    });
  };

  const handleDoctorToggle = () => {
    const isSelected = !doctorService.selected;
    onChange({
      ...doctorService,
      price: isSelected ? parseFloat(doctorService.price) : null,
      percentage: isSelected ? parseInt(doctorService.percentage) : null,
      selected: isSelected,
    });
  };

  const textClasses = clsx(
    styles.text,
    doctorService.selected ? styles.selected : styles.default,
  );

  const isPercentageDisabled =
    !doctorService.selected || doctorService.price.length > 0;
  const isPriceDisabled =
    !doctorService.selected || doctorService.percentage.length > 0;

  return (
    <div className={styles.serviceDoctor}>
      <div className={styles.nameAndSwitch}>
        <SwitchButton
          isChecked={doctorService.selected}
          onChange={handleDoctorToggle}
        />
        <div className={textClasses}>{doctorService.fullName}</div>
      </div>
      <div className={styles.fields}>
        <EASTextField
          type='number'
          containerClass={styles.field}
          readOnly={isPercentageDisabled}
          value={String(doctorService.percentage)}
          placeholder='0'
          endAdornment={<Typography className={styles.adornment}>%</Typography>}
          onChange={handlePercentageChange}
        />

        <EASTextField
          type='number'
          containerClass={styles.field}
          readOnly={isPriceDisabled}
          value={String(doctorService.price)}
          placeholder='0'
          endAdornment={
            <Typography className={styles.adornment}>
              {clinic?.currency || 'MDL'}
            </Typography>
          }
          onChange={handlePriceChanged}
        />
      </div>
    </div>
  );
};

export default ServiceDoctor;

ServiceDoctor.propTypes = {
  serviceData: PropTypes.shape({
    fullName: PropTypes.string,
    id: PropTypes.number,
    percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    selected: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

ServiceDoctor.defaultProps = {
  onChange: () => null,
};
