import React, { useEffect, useMemo, useState } from 'react';
import Button from '@material-ui/core/Button';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";

import { textForKey } from '../../../../../utils/localization';
import LeftSideModal from '../../../common/LeftSideModal';
import { createService, updateService } from "../../../../../middleware/api/services";
import IconClose from '../../../icons/iconClose';
import IconSuccess from '../../../icons/iconSuccess';
import LoadingButton from '../../../common/LoadingButton';
import { closeServiceDetailsModal } from '../../../../../redux/actions/serviceDetailsActions';
import { serviceDetailsModalSelector } from '../../../../../redux/selectors/serviceDetailsSelector';
import { setUpdatedService } from "../../../../../redux/actions/servicesActions";
import { clinicActiveDoctorsSelector } from "../../../../../redux/selectors/clinicSelector";
import styles from './ServiceDetailsModal.module.scss';

const ServiceDoctors = dynamic(() => import('./ServiceDoctors'));
const ServiceInformation = dynamic(() => import('./ServiceInformation'));

const initialService = {
  name: '',
  price: '',
  duration: '',
  description: '',
  color: '',
  doctors: [],
  categoryId: null,
  serviceType: 'All',
  currency: 'MDL',
};

const ServiceDetailsModal = ({ currentClinic }) => {
  const dispatch = useDispatch();
  const { category, service, open } = useSelector(serviceDetailsModalSelector);
  const modalData = useSelector(serviceDetailsModalSelector);
  const clinicDoctors = clinicActiveDoctorsSelector(currentClinic)
  const clinicCurrency = currentClinic?.currency;
  const [expandedMenu, setExpandedMenu] = useState('info');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({
    ...initialService,
    currency: clinicCurrency,
  });

  useEffect(() => {
    const { category, service, open } = modalData;

    if (!open) {
      // modal is closed so we need to reset the expanded component
      setExpandedMenu('info');
    }

    if (service != null) {
      // update service data with specified service
      setServiceInfo({ ...service, doctors: mappedServices });
    } else {
      // update category id na doctors
      setServiceInfo({
        ...initialService,
        categoryId: category?.id,
        doctors: mappedServices,
      });
    }
  }, [modalData]);

  useEffect(() => {
    setIsFormValid(
      serviceInfo.name.length > 0 &&
      serviceInfo.color.length > 0 &&
      parseInt(serviceInfo.duration) > 0,
    );
  }, [serviceInfo]);

  const mappedServices = useMemo(() => {
    return clinicDoctors.map((item) => {
      const itemService = item.services.find(
        (it) => it.serviceId === service?.id,
      );
      return {
        doctorId: item.id,
        doctorName: item.fullName,
        selected: itemService != null,
        price: itemService?.price,
        percentage: itemService?.percentage,
      };
    });
  }, [clinicDoctors]);

  const handleSaveService = async () => {
    setIsLoading(true);
    if (serviceInfo.price.length === 0) serviceInfo.price = '0';
    serviceInfo.doctors = serviceInfo.doctors.map((item) => {
      if (item.selected && item.price == null && !item.percentage == null) {
        item.price = 0;
      }
      return item;
    });
    let responseData;
    if (service != null) {
      responseData = await handleEditService(serviceInfo);
    } else {
      responseData = await handleCreateService(serviceInfo);
    }
    dispatch(setUpdatedService(responseData));
    setIsLoading(false);
    handleCloseModal();
  };

  const handleCreateService = async (serviceInfo) => {
    try {
      const response = await createService(serviceInfo);
      return response.data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditService = async (serviceInfo) => {
    try {
      const response = await updateService(service.id, serviceInfo);
      return response.data;
    } catch (error) {
      toast.error(error.message);
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
    dispatch(closeServiceDetailsModal(true));
  };

  const handleDoctorChange = (doctorService) => {
    const newServices = serviceInfo.doctors.map((item) => {
      if (item.doctorId !== doctorService.doctorId) {
        return item;
      }

      return doctorService;
    });
    setServiceInfo({
      ...serviceInfo,
      doctors: newServices,
    });
  };

  const handleInfoChanged = (newInfo) => {
    setServiceInfo(newInfo);
  };

  return (
    <LeftSideModal
      show={open}
      onClose={handleCloseModal}
      steps={[
        textForKey('Categories'),
        textForKey(category?.name || textForKey('All services')),
        service == null
          ? textForKey('Add service')
          : textForKey('Edit service'),
      ]}
      title={
        service == null ? textForKey('Add service') : textForKey('Edit service')
      }
    >
      <div className={styles.serviceDetailsModal}>
        {open && (
          <div className={styles.data}>
            <ServiceInformation
              isExpanded
              currentClinic={currentClinic}
              clinicCurrency={clinicCurrency}
              onChange={handleInfoChanged}
              data={serviceInfo}
              onToggle={handleInfoToggle}
              showStep={service == null}
            />

            <ServiceDoctors
              isExpanded
              clinic={currentClinic}
              onDoctorChange={handleDoctorChange}
              serviceId={service?.id}
              doctors={serviceInfo.doctors}
              onToggle={handleDoctorsToggle}
              showStep={!service}
            />
          </div>
        )}

        <div className={styles.footer}>
          <Button
            className={styles.closeButton}
            disabled={isLoading}
            onClick={handleCloseModal}
          >
            {textForKey('Close')}
            <IconClose />
          </Button>
          <LoadingButton
            onClick={handleSaveService}
            className={styles.saveButton}
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
          >
            {textForKey('Save')}
            {!isLoading && <IconSuccess />}
          </LoadingButton>
        </div>
      </div>
    </LeftSideModal>
  );
};

export default ServiceDetailsModal;
