import React from 'react';

import PropTypes from 'prop-types';

import IconClose from '../../assets/icons/iconClose';
import LeftSideModal from '../LeftSideModal';
import './styles.scss';
import IconArrowNext from '../../assets/icons/iconArrowNext';

const ServiceDetailsModal = props => {
  const { show, onClose } = props;
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
      </div>
    </LeftSideModal>
  );
};

export default ServiceDetailsModal;

ServiceDetailsModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
};
