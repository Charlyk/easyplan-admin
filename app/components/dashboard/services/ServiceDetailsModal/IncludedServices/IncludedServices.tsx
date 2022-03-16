import React, { useEffect, useMemo, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import orderBy from 'lodash/orderBy';
import { useSelector } from 'react-redux';
import EASAutocomplete from 'app/components/common/EASAutocomplete';
import IconTrash from 'app/components/icons/iconTrash';
import getServiceName from 'app/utils/getServiceName';
import { textForKey } from 'app/utils/localization';
import { clinicServicesSelector } from 'redux/selectors/appDataSelector';
import {
  detailsModalSelector,
  serviceDetailsIncludedSelector,
} from 'redux/selectors/servicesSelector';
import { ClinicService, IncludedService } from 'types';
import styles from './IncludedServices.module.scss';
import { IncludedServicesProps } from './IncludedServices.types';

const IncludedServices: React.FC<IncludedServicesProps> = ({
  showStep,
  onChange,
}) => {
  const { service } = useSelector(detailsModalSelector);
  const allServices = useSelector(clinicServicesSelector);
  const initialServices = useSelector(serviceDetailsIncludedSelector);
  const [selectedServices, setSelectedServices] = useState<IncludedService[]>(
    [],
  );

  const mappedOptions = useMemo(() => {
    const mapped = allServices
      .filter((item) => item.id !== service?.id)
      .map((item) => ({
        ...item,
        name: getServiceName(item),
      }));
    return orderBy(mapped, 'name', 'asc');
  }, [allServices, service]);

  useEffect(() => {
    setSelectedServices(initialServices);
  }, [initialServices]);

  useEffect(() => {
    onChange?.(
      selectedServices.map((item) => ({ id: item.id, name: item.name })),
    );
  }, [selectedServices]);

  const handleItemSelected = (event, newService: ClinicService) => {
    setSelectedServices((state) => {
      if (!state.some((item) => item.id === newService.id)) {
        return [...state, { id: newService.id, name: newService.name }];
      }
      return state;
    });
  };

  const handleRemoveService = (service: IncludedService) => {
    setSelectedServices((state) =>
      state.filter((item) => item.id !== service.id),
    );
  };

  return (
    <div className={styles.includedServices}>
      <div className={styles.header}>
        <div className={styles.title}>
          {showStep && (
            <div className={styles.step}>{textForKey('Step 2.')}</div>
          )}
          {textForKey('Included services')}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.fieldContainer}>
          <EASAutocomplete
            filterLocally
            clearOnSelect
            value={null}
            placeholder={textForKey('Enter service name')}
            options={mappedOptions}
            onChange={handleItemSelected}
            helperText={undefined}
            error={undefined}
          />
        </div>
        <div className={styles.servicesContainer}>
          {selectedServices.map((item) => (
            <div key={item.id} className={styles.row}>
              <Typography className={styles.title}>{item.name}</Typography>
              <IconButton
                className={styles.button}
                disableRipple
                onClick={() => handleRemoveService(item)}
              >
                <IconTrash fill='red' />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncludedServices;
