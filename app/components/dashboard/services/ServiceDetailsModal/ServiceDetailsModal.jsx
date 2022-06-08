import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import dynamic from 'next/dynamic';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import LeftSideModal from 'app/components/common/LeftSideModal';
import LoadingButton from 'app/components/common/LoadingButton';
import IconClose from 'app/components/icons/iconClose';
import IconSuccess from 'app/components/icons/iconSuccess';
import NotificationsContext from 'app/context/notificationsContext';
import onRequestFailed from 'app/utils/onRequestFailed';
import { createService, updateService } from 'middleware/api/services';
import {
  activeClinicDoctorsSelector,
  clinicCurrencySelector,
} from 'redux/selectors/appDataSelector';
import {
  detailsModalSelector,
  isFetchingDetailsSelector,
  serviceDetailsSelector,
} from 'redux/selectors/servicesSelector';
import {
  fetchServiceDetails,
  fetchServicesList,
  closeDetailsModal,
} from 'redux/slices/servicesListSlice';
import { ClinicServiceType } from 'types';
import IncludedServices from './IncludedServices';
import styles from './ServiceDetailsModal.module.scss';

const ServiceDoctors = dynamic(() => import('./ServiceDoctors'));
const ServiceInformation = dynamic(() => import('./ServiceInformation'));

const getInitialService = (doctors, categoryId, currency) => {
  return {
    id: null,
    name: '',
    color: '',
    description: '',
    deleted: false,
    price: '',
    duration: '15',
    includedServices: [],
    serviceType: ClinicServiceType.All,
    doctors: doctors.map((item) => ({
      id: item.id,
      fullName: item.fullName,
      price: null,
      percentage: null,
      selected: false,
    })),
    categoryId,
    currency,
  };
};

const ServiceDetailsModal = () => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const { category, service, open } = useSelector(detailsModalSelector);
  const clinicCurrency = useSelector(clinicCurrencySelector);
  const clinicDoctors = useSelector(activeClinicDoctorsSelector);
  const serviceInfo = useSelector(serviceDetailsSelector);
  const isLoading = useSelector(isFetchingDetailsSelector);
  const initialService = getInitialService(
    clinicDoctors,
    category?.id,
    clinicCurrency,
  );
  const [serviceDetails, setServiceDetails] = useState(
    serviceInfo ?? initialService,
  );
  const [expandedMenu, setExpandedMenu] = useState('info');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (service == null) {
      return;
    }
    dispatch(fetchServiceDetails(service.id));
  }, [service]);

  useEffect(() => {
    if (!open) {
      setServiceDetails(initialService);
    }
  }, [open]);

  useEffect(() => {
    if (serviceInfo != null) {
      setServiceDetails(serviceInfo);
    }
  }, [serviceInfo]);

  useEffect(() => {
    if (serviceDetails == null) {
      return;
    }
    setIsFormValid(
      serviceDetails.name?.length > 0 &&
        serviceDetails.color?.length > 0 &&
        parseInt(serviceDetails?.duration) >= 15 &&
        parseInt(serviceDetails?.duration) <= 360,
    );
  }, [serviceDetails]);

  const handleSaveService = async () => {
    if (serviceDetails.price.length === 0) serviceDetails.price = '0';
    serviceDetails.doctors = serviceDetails.doctors.map((item) => {
      if (item.selected && item.price == null && !item.percentage == null) {
        item.price = 0;
      }
      return item;
    });
    if (service != null) {
      await handleEditService({
        ...serviceDetails,
        categoryId: serviceDetails?.category?.id,
      });
    } else {
      await handleCreateService({
        ...serviceDetails,
        categoryId: category?.id,
      });
    }
    dispatch(fetchServicesList());
    toast.success(textForKey('saved successfully'));
    handleCloseModal();
  };

  const handleCreateService = async (serviceInfo) => {
    try {
      await createService(serviceInfo);
    } catch (error) {
      onRequestFailed(error, toast);
    }
  };

  const handleEditService = async (serviceInfo) => {
    try {
      await updateService(service.id, serviceInfo);
    } catch (error) {
      onRequestFailed(error, toast);
    }
  };

  const handleInfoToggle = () => {
    if (expandedMenu === 'info') {
      setExpandedMenu('');
    } else {
      setExpandedMenu('info');
    }
  };

  const handleDoctorsToggle = () => {
    if (expandedMenu === 'doctors') {
      setExpandedMenu('');
    } else {
      setExpandedMenu('doctors');
    }
  };

  const handleCloseModal = () => {
    if (isLoading) return;
    dispatch(closeDetailsModal());
  };

  const handleDoctorChange = (doctorService) => {
    const newServices = serviceDetails.doctors.map((item) => {
      if (item.id !== doctorService.id) {
        return item;
      }

      return doctorService;
    });
    setServiceDetails({
      ...serviceDetails,
      doctors: newServices,
    });
  };

  const handleInfoChanged = (newInfo) => {
    setServiceDetails({ ...serviceDetails, ...newInfo });
  };

  const handleIncludedServicesChange = (services) => {
    setServiceDetails((state) => ({
      ...state,
      nestedServices: services.map((item) => item.id),
    }));
  };

  return (
    <LeftSideModal
      show={open}
      onClose={handleCloseModal}
      steps={[
        textForKey('categories'),
        textForKey(category?.name || textForKey('all services')),
        service == null
          ? textForKey('Add service')
          : textForKey('Edit service'),
      ]}
      title={
        service == null ? textForKey('add service') : textForKey('edit service')
      }
    >
      <div className={styles.serviceDetailsModal}>
        <div className={styles.content}>
          {open && !isLoading && (
            <>
              <ServiceInformation
                isExpanded
                clinicCurrency={clinicCurrency}
                onChange={handleInfoChanged}
                data={serviceDetails}
                onToggle={handleInfoToggle}
                showStep={service == null}
              />
              <IncludedServices
                showStep={service == null}
                initial={serviceInfo?.includedServices ?? []}
                onChange={handleIncludedServicesChange}
              />
              <ServiceDoctors
                isExpanded
                onDoctorChange={handleDoctorChange}
                serviceId={service?.id}
                doctors={serviceDetails.doctors}
                onToggle={handleDoctorsToggle}
                showStep={!service}
              />
            </>
          )}
        </div>

        <div className={styles.footer}>
          <Button
            className={styles.closeButton}
            disabled={isLoading}
            onClick={handleCloseModal}
          >
            {textForKey('close')}
            <IconClose />
          </Button>
          <LoadingButton
            onClick={handleSaveService}
            className={styles.saveButton}
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
          >
            {textForKey('save')}
            {!isLoading && <IconSuccess />}
          </LoadingButton>
        </div>
      </div>
    </LeftSideModal>
  );
};

export default ServiceDetailsModal;
