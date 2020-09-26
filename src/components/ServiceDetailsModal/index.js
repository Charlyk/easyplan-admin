import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import IconArrowNext from '../../assets/icons/iconArrowNext';
import IconClose from '../../assets/icons/iconClose';
import IconDelete from '../../assets/icons/iconDelete';
import IconSuccess from '../../assets/icons/iconSuccess';
import { triggerCategoriesUpdate } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import LeftSideModal from '../LeftSideModal';
import './styles.scss';
import LoadingButton from '../LoadingButton';
import ServiceDoctors from './ServiceDoctors';
import ServiceInformation from './ServiceInformation';
import ConfirmationModal from '../ConfirmationModal';

const initialService = {
  name: '',
  price: '',
  duration: '',
  description: '',
  color: '',
  doctors: [],
  categoryId: null,
};

const ServiceDetailsModal = props => {
  const { show, onClose, category, service } = props;
  const dispatch = useDispatch();
  const [expandedMenu, setExpandedMenu] = useState('info');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [doctors, setDoctors] = useState([]);
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
    if (service != null) {
      setServiceInfo(service);
    }
  }, [service]);

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

  const fetchDoctors = () => {
    dataAPI
      .fetchServiceDoctors(service?.id)
      .then(response => {
        if (!response.isError) {
          setDoctors(response.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleSaveService = () => {
    setIsLoading(true);
    if (serviceInfo.price.length === 0) serviceInfo.price = '0';
    if (service != null) {
      editService();
    } else {
      createService();
    }
  };

  const createService = () => {
    dataAPI
      .createService(serviceInfo)
      .then(() => {
        setIsLoading(false);
        dispatch(triggerCategoriesUpdate());
        handleCloseModal();
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const editService = () => {
    dataAPI
      .editService(serviceInfo, service.id)
      .then(() => {
        setIsLoading(false);
        dispatch(triggerCategoriesUpdate());
        handleCloseModal();
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const deleteService = () => {
    setIsDeleting(true);
    dataAPI
      .deleteService(service.id)
      .then(response => {
        if (!response.isError) {
          setDeleteConfirmationVisible(false);
          dispatch(triggerCategoriesUpdate());
          handleCloseModal();
        }
        setIsDeleting(false);
      })
      .catch(error => {
        console.error(error);
        setIsDeleting(false);
      });
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
            doctors={doctors}
            onToggle={handleDoctorsToggle}
            isExpanded={expandedMenu === 'doctors'}
            showStep={service == null}
          />
        </div>

        <div className='service-doctors__footer'>
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
