import React, { useEffect, useMemo, useState } from 'react';

import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import IconClose from '../icons/iconClose';
import IconSuccess from '../icons/iconSuccess';
import { closeServiceDetailsModal } from '../../redux/actions/serviceDetailsActions';
import { serviceDetailsModalSelector } from '../../redux/selectors/serviceDetailsSelector';
import dataAPI from '../../utils/api/dataAPI';
import { Action, Role } from '../../utils/constants';
import { fetchClinicData, logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import LeftSideModal from '../../src/components/LeftSideModal';
import LoadingButton from '../LoadingButton';
import ServiceDoctors from './ServiceDoctors';
import ServiceInformation from './ServiceInformation';
import styles from '../../styles/ServiceDetailsModal.module.scss';
import axios from "axios";
import { baseAppUrl } from "../../eas.config";
import { toast } from "react-toastify";
import { setUpdatedService } from "../../redux/actions/servicesActions";

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
  const clinicDoctors = currentClinic.users.filter(item => item.roleInClinic === Role.doctor);
  const clinicCurrency = currentClinic.currency;
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
      responseData = await editService(serviceInfo);
    } else {
      responseData = await createService(serviceInfo);
    }
    dispatch(setUpdatedService(responseData));
    setIsLoading(false);
    handleCloseModal();
  };

  const createService = async (serviceInfo) => {
    try {
      const response = await axios.post(`${baseAppUrl}/api/services`, serviceInfo);
      return response.data;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editService = async (serviceInfo) => {
    try {
      const response = await axios.put(`${baseAppUrl}/api/services/${service.id}`, serviceInfo);
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
      <div className={styles['service-details-modal']}>
        <div className={styles['service-details-modal__data']}>
          <ServiceInformation
            clinicCurrency={clinicCurrency}
            onChange={handleInfoChanged}
            data={serviceInfo}
            onToggle={handleInfoToggle}
            isExpanded={expandedMenu === 'info'}
            showStep={service == null}
          />

          <ServiceDoctors
            onDoctorChange={handleDoctorChange}
            serviceId={service?.id}
            doctors={serviceInfo.doctors}
            onToggle={handleDoctorsToggle}
            isExpanded={expandedMenu === 'doctors'}
            showStep={!service}
          />
        </div>

        <div className={styles['service-details-modal__footer']}>
          <Button
            className='cancel-button'
            disabled={isLoading}
            onClick={handleCloseModal}
          >
            {textForKey('Close')}
            <IconClose />
          </Button>
          <LoadingButton
            onClick={handleSaveService}
            className='positive-button'
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
