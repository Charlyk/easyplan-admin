import React from 'react';

import PropTypes from 'prop-types';

import './styles.scss';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';

const ConfirmationModal = props => {
  const { show, title, message, onConfirm, onClose, isLoading } = props;
  return (
    <EasyPlanModal
      onClose={onClose}
      open={show}
      title={title}
      hidePositiveBtn={onConfirm == null}
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
