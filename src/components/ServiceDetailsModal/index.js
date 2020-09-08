import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import IconArrowNext from '../../assets/icons/iconArrowNext';
import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import { triggerCategoriesUpdate } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
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
};

const ServiceDetailsModal = props => {
  const { show, onClose, category, service } = props;
  const dispatch = useDispatch();
  const [expandedMenu, setExpandedMenu] = useState('info');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({
    ...initialService,
    categoryId: category?.id,
  });

  useEffect(() => {
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

  const handleSaveService = () => {
    setIsLoading(true);
    if (serviceInfo.price.length === 0) serviceInfo.price = '0';
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

  return (
    <LeftSideModal show={show} onClose={handleCloseModal}>
      <div className='service-details-modal'>
        <div className='service-details-modal__header'>
          <div className='service-details-modal__header__close-container'>
            <div className='close-btn' onClick={handleCloseModal}>
              <IconClose />
            </div>
          </div>
          <div className='service-details-modal__header__title'>
            {service == null
              ? textForKey('Add service')
              : textForKey('Edit service')}
          </div>
          <div className='service-details-modal__header__breadcrumb-container'>
            <div className='service-details-modal__header__breadcrumb current'>
              {textForKey('Categories')}
            </div>
            {category && <IconArrowNext />}
            {category && (
              <div className='service-details-modal__header__breadcrumb current'>
                {category.name}
              </div>
            )}
            <IconArrowNext />
            <div className='service-details-modal__header__breadcrumb'>
              {service == null
                ? textForKey('Add service')
                : textForKey('Edit service')}
            </div>
          </div>
        </div>

        <div className='service-details-modal__data'>
          <ServiceInformation
            onChange={handleInfoChanged}
            data={serviceInfo}
            onToggle={handleInfoToggle}
            isExpanded={expandedMenu === 'info'}
            showStep={service == null}
          />

          <ServiceDoctors
            onToggle={handleDoctorsToggle}
            isExpanded={expandedMenu === 'doctors'}
            showStep={service == null}
          />
        </div>

        <div className='service-doctors__footer'>
          <Button className='cancel-button' onClick={handleCloseModal}>
            {textForKey('Cancel')}
            <IconClose />
          </Button>
          <LoadingButton
            onClick={handleSaveService}
            className='positive-button'
            showLoading={isLoading}
            disabled={!isFormValid}
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
