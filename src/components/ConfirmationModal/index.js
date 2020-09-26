import React from 'react';

import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

import './styles.scss';
import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import LoadingButton from '../LoadingButton';

const ConfirmationModal = props => {
  const { show, title, message, onConfirm, onClose, isLoading } = props;
  return (
    <EasyPlanModal
      onClose={onClose}
      open={show}
      title={title}
      isPositiveLoading={isLoading}
      className='confirmation-modal'
      positiveBtnText={textForKey('Confirm')}
      onPositiveClick={onConfirm}
    >
      {message}
    </EasyPlanModal>
  );
};

export default ConfirmationModal;

ConfirmationModal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  isLoading: PropTypes.bool,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
};
