import React from 'react';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import FinalServiceItem from 'app/components/doctors/FinalServiceItem';
import styles from './ServicesWrapper.module.scss';

const ServicesWrapper = ({ allServices, paperClasses }) => {
  return (
    <Paper className={styles.servicesWrapper} elevation={0}>
      <div className={clsx(styles.selectedServicesWrapper, paperClasses)}>
        <table style={{ width: '100%' }}>
          <tbody>
            {allServices.map((service) => (
              <FinalServiceItem
                key={service.id}
                canRemove={false}
                service={service}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Paper>
  );
};

export default ServicesWrapper;

ServicesWrapper.propTypes = {
  readOnly: PropTypes.bool,
  allServices: PropTypes.arrayOf(PropTypes.object),
  selectedServices: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  isButtonDisabled: PropTypes.bool,
  buttonText: PropTypes.string,
  onItemSelected: PropTypes.func,
  onItemRemove: PropTypes.func,
  onFinalize: PropTypes.func,
  paperClasses: PropTypes.any,
};
