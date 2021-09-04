import React from 'react';
import PropTypes from 'prop-types';

import styles from './ConfirmationModal.module.scss';
import { textForKey } from '../../../../../utils/localization';
import EasyPlanModal from '../EasyPlanModal';

const ConfirmationModal = ({ show, title, message, onConfirm, onClose, isLoading }) => {
  return (
    <EasyPlanModal
      onClose={onClose}
      open={show}
      title={title}
      hidePositiveBtn={onConfirm == null}
      isPositiveLoading={isLoading}
      className={styles['confirmation-modal']}
      positiveBtnText={textForKey('Confirm')}
      onPositiveClick={onConfirm}
      size='sm'
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
