import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import IconClose from '../../assets/icons/iconClose';
import IconDelete from '../../assets/icons/iconDelete';
import IconSuccess from '../../assets/icons/iconSuccess';
import { triggerCategoriesUpdate } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { Action } from '../../utils/constants';
import { logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import ConfirmationModal from '../ConfirmationModal';
import LeftSideModal from '../LeftSideModal';
import './styles.scss';
import LoadingButton from '../LoadingButton';
import ServiceDoctors from './ServiceDoctors';
import ServiceInformation from './ServiceInformation';

const initialService = {
  name: '',
  price: '',
  duration: '',
  description: '',
  color: '',
  doctors: [],
  categoryId: null,
  serviceType: 'all',
};

const ServiceDetailsModal = props => {
  const { show, onClose, category, service } = props;
  const dispatch = useDispatch();
  const [expandedMenu, setExpandedMenu] = useState('info');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(
    false,
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({
    ...initialService,
    categoryId: category?.id,
  });

  useEffect(() => {
    fetchDoctors();
    if (service != null && show) {
      setServiceInfo(service);
      logUserAction(Action.ViewService, JSON.stringify(service));
    }
  }, [show, service]);

  useEffect(() => {
    setServiceInfo({
      ...serviceInfo,
      categoryId: category?.id,
    });
  }, [category]);

  useEffect(() => {
    setIsFormValid(
      serviceInfo.name.length > 0 &&
        serviceInfo.color.length > 0 &&
        parseInt(serviceInfo.duration) > 0,
    );
  }, [serviceInfo]);

  const fetchDoctors = async () => {
    const response = await dataAPI.getClinicDoctors();
    if (response.isError) {
      console.error(response.message);
    } else {
      const doctorsService = response.data.map(item => {
        const itemService = item.services.find(it => it.id === service?.id);
        return {
          doctorId: item.id,
          doctorName: `${item.firstName} ${item.lastName}`,
          selected: itemService != null,
          price: itemService?.price,
          percentage: itemService?.percentage,
        };
      });
      if (service != null) {
        setServiceInfo({
          ...service,
          doctors: doctorsService,
        });
      } else {
        setServiceInfo({
          ...serviceInfo,
          doctors: doctorsService,
        });
      }
    }
  };

  const handleSaveService = async () => {
    setIsLoading(true);
    if (serviceInfo.price.length === 0) serviceInfo.price = '0';
    serviceInfo.doctors = serviceInfo.doctors.map(item => {
      if (item.selected && item.price == null && !item.percentage == null) {
        item.price = 0;
      }
      return item;
    });
    if (service != null) {
      await editService();
    } else {
      await createService();
    }
    setIsLoading(false);
  };

  const createService = async () => {
    const response = await dataAPI.createService(serviceInfo);
    if (response.isError) {
      console.error(response.message);
    } else {
      logUserAction(Action.CreateService, JSON.stringify(serviceInfo));
      dispatch(triggerCategoriesUpdate());
      handleCloseModal();
    }
  };

  const editService = async () => {
    const response = await dataAPI.editService(serviceInfo, service.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      logUserAction(
        Action.EditService,
        JSON.stringify({
          before: service,
          after: serviceInfo,
        }),
      );
      dispatch(triggerCategoriesUpdate());
      handleCloseModal();
    }
  };

  const deleteService = async () => {
    setIsDeleting(true);
    const response = await dataAPI.deleteService(service.id);
    if (!response.isError) {
      logUserAction(Action.DeleteService, JSON.stringify(service));
      setDeleteConfirmationVisible(false);
      dispatch(triggerCategoriesUpdate());
      handleCloseModal();
    } else {
      console.error(response.message);
    }
    setIsDeleting(false);
  };

  const handleDeleteService = () => {
    setDeleteConfirmationVisible(true);
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
    if (isLoading || isDeleting) return;
    setServiceInfo({
      ...initialService,
      categoryId: category?.id,
    });
    setExpandedMenu('info');
    onClose();
  };

  const handleDoctorChange = doctorService => {
    const newServices = serviceInfo.doctors.map(item => {
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

  const handleInfoChanged = newInfo => {
    setServiceInfo(newInfo);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationVisible(false);
  };

  return (
    <LeftSideModal
      show={show}
      onClose={handleCloseModal}
      steps={[
        textForKey('Categories'),
        category.name,
        service == null
          ? textForKey('Add service')
          : textForKey('Edit service'),
      ]}
      title={
        service == null ? textForKey('Add service') : textForKey('Edit service')
      }
    >
      <ConfirmationModal
        onConfirm={deleteService}
        show={isDeleteConfirmationVisible}
        onClose={handleDeleteCancel}
        isLoading={isDeleting}
        title={textForKey('Delete service')}
        message={textForKey('Are you sure you want to delete this service?')}
      />
      <div className='service-details-modal'>
        <div className='service-details-modal__data'>
          <ServiceInformation
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

        <div className='service-details-modal__footer'>
          <Button
            className='cancel-button'
            disabled={isLoading || isDeleting}
            onClick={handleCloseModal}
          >
            {textForKey('Close')}
            <IconClose />
          </Button>
          {service && (
            <LoadingButton
              onClick={handleDeleteService}
              className='delete-button'
              disabled={isDeleting || isLoading}
              isLoading={isDeleting}
            >
              {textForKey('Delete')}
              {!isDeleting && <IconDelete />}
            </LoadingButton>
          )}
          <LoadingButton
            onClick={handleSaveService}
            className='positive-button'
            isLoading={isLoading}
            disabled={!isFormValid || isLoading || isDeleting}
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

ServiceDetailsModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  service: PropTypes.object,
  category: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    servicesCount: PropTypes.number,
  }),
};
