import React, { useMemo } from 'react';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASAutocomplete from 'app/components/common/EASAutocomplete';
import { updateConsultationService } from 'middleware/api/services';
import {
  clinicServicesSelector,
  consultationServiceSelector,
} from 'redux/selectors/appDataSelector';
import { setConsultationService } from 'redux/slices/appDataSlice';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../../../../../redux/slices/globalNotificationsSlice';
import styles from './ConsultationService.module.scss';

const ConsultationService: React.FC = () => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const services = useSelector(clinicServicesSelector);
  const consultationService = useSelector(consultationServiceSelector);

  const mappedServices = useMemo(() => {
    return services.map((item) => ({ ...item, label: item.name }));
  }, [services]);

  const handleServiceChange = async (event, selectedService) => {
    try {
      await updateConsultationService(selectedService?.id);
      dispatch(setConsultationService(selectedService));
      dispatch(showSuccessNotification(textForKey('saved successfully')));
    } catch (e) {
      dispatch(showErrorNotification(textForKey('error')));
    }
  };

  return (
    <div className={styles.consultationService}>
      <EASAutocomplete
        filterLocally
        disabled={mappedServices.length === 0}
        containerClass={styles.simpleField}
        options={mappedServices}
        value={
          consultationService
            ? { ...consultationService, label: consultationService?.name }
            : null
        }
        fieldLabel={textForKey('service')}
        placeholder={textForKey('enter service name')}
        onChange={handleServiceChange}
        helperText={null}
        error={null}
      />
    </div>
  );
};

export default ConsultationService;
