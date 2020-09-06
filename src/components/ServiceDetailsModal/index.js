import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import { textForKey } from '../../utils/localization';
import LeftSideModal from '../LeftSideModal';
import './styles.scss';
import IconArrowNext from '../../assets/icons/iconArrowNext';
import LoadingButton from '../LoadingButton';
import ServiceDoctors from './ServiceDoctors';
import ServiceInformation from './ServiceInformation';

const ServiceDetailsModal = props => {
  const { show, onClose } = props;
  const [expandedMenu, setExpandedMenu] = useState('info');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <LeftSideModal show={show} onClose={onClose}>
      <div className='service-details-modal'>
        <div className='service-details-modal__header'>
          <div className='service-details-modal__header__close-container'>
            <div className='close-btn' onClick={onClose}>
              <IconClose />
            </div>
          </div>
          <div className='service-details-modal__header__title'>
            Add service
          </div>
          <div className='service-details-modal__header__breadcrumb-container'>
            <div className='service-details-modal__header__breadcrumb current'>
              Categories
            </div>
            <IconArrowNext />
            <div className='service-details-modal__header__breadcrumb current'>
              Implantologie
            </div>
            <IconArrowNext />
            <div className='service-details-modal__header__breadcrumb'>
              Add service
            </div>
          </div>
        </div>

        <div className='service-details-modal__data'>
          <ServiceInformation
            onToggle={handleInfoToggle}
            isExpanded={expandedMenu === 'info'}
            showStep={true}
          />

          <ServiceDoctors
            onToggle={handleDoctorsToggle}
            isExpanded={expandedMenu === 'doctors'}
            showStep={true}
          />
        </div>

        <div className='service-doctors__footer'>
          <Button className='cancel-button' onClick={onClose}>
            {textForKey('Cancel')}
            <IconClose />
          </Button>
          <LoadingButton className='positive-button' showLoading={isLoading}>
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
};
