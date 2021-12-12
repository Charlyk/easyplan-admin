import React, { useMemo } from 'react';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import EASAutocomplete from 'app/components/common/EASAutocomplete';
import LoadingButton from 'app/components/common/LoadingButton';
import FinalServiceItem from 'app/components/doctors/FinalServiceItem';
import getServiceName from 'app/utils/getServiceName';
import { textForKey } from 'app/utils/localization';
import styles from './ServicesWrapper.module.scss';

const ServicesWrapper = ({
  readOnly,
  allServices,
  selectedServices,
  isLoading,
  isButtonDisabled,
  buttonText,
  paperClasses,
  onItemSelected,
  onItemRemove,
  onFinalize,
}) => {
  /**
   * Get unique html key for a service item
   * @param {Object} service
   * @return {string}
   */
  const keyForService = (service) => {
    return `${service.id}-${service.toothId}-${service.name}-${service.destination}-${service.completed}-${service.completedAt}-${service.scheduleId}`;
  };

  const mappedOptions = useMemo(() => {
    return allServices.map((item) => ({
      ...item,
      name: getServiceName(item),
    }));
  }, [allServices]);

  return (
    <Paper className={styles.servicesWrapper} elevation={0}>
      {!readOnly && (
        <div className={styles.inputWrapper}>
          <EASAutocomplete
            filterLocally
            clearOnSelect
            value={null}
            placeholder={textForKey('Enter service name')}
            options={mappedOptions}
            onChange={onItemSelected}
          />
        </div>
      )}

      <div className={clsx(styles.selectedServicesWrapper, paperClasses)}>
        <table style={{ width: '100%' }}>
          <tbody>
            {selectedServices.map((service, index) => (
              <FinalServiceItem
                canRemove={!service.completed}
                onRemove={onItemRemove}
                key={`${keyForService(service)}#${index}`}
                service={service}
              />
            ))}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <div className={styles.selectedServicesFooter}>
          <LoadingButton
            isLoading={isLoading}
            onClick={onFinalize}
            disabled={isButtonDisabled}
            className='positive-button'
          >
            {buttonText}
          </LoadingButton>
        </div>
      )}
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
