import React from 'react';

import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import { textForKey } from '../../utils/localization';
import './EasyPlanModal.module.scss';
import LoadingButton from '../LoadingButton';

const EasyPlanModal = ({
  open,
  title,
  children,
  size,
  negativeBtnText,
  positiveBtnText,
  positiveBtnIcon,
  isPositiveDisabled,
  isNegativeDisabled,
  isPositiveLoading,
  isNegativeLoading,
  hidePositiveBtn,
  className,
  onPositiveClick,
  onNegativeClick,
  onClose,
}) => {
  return (
    <Modal
      centered
      size={size}
      className={`easyplan-modal-root easyplan-modal ${className}`}
      show={open}
      onHide={typeof onClose === 'function' ? onClose : () => null}
    >
      <Modal.Header>
        {title}
        {typeof onClose === 'function' && (
          <div
            role='button'
            tabIndex={0}
            className='close-btn'
            onClick={onClose}
          >
            <IconClose />
          </div>
        )}
      </Modal.Header>
      <Modal.Body className='easyplan-modal-body'>{children}</Modal.Body>
      <Modal.Footer>
        {typeof onClose === 'function' && (
          <LoadingButton
            disabled={isNegativeDisabled}
            isLoading={isNegativeLoading}
            className='cancel-button'
            onClick={onNegativeClick || onClose}
          >
            {negativeBtnText}
            {!isNegativeLoading} <IconClose />
          </LoadingButton>
        )}
        {!hidePositiveBtn && (
          <LoadingButton
            disabled={isPositiveDisabled}
            isLoading={isPositiveLoading}
            className='positive-button'
            onClick={onPositiveClick}
          >
            {positiveBtnText}
            {!isPositiveLoading && positiveBtnIcon}
          </LoadingButton>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EasyPlanModal;

EasyPlanModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.any,
  hidePositiveBtn: PropTypes.bool,
  negativeBtnText: PropTypes.string,
  positiveBtnText: PropTypes.string,
  positiveBtnIcon: PropTypes.any,
  isPositiveLoading: PropTypes.bool,
  isNegativeLoading: PropTypes.bool,
  isPositiveDisabled: PropTypes.bool,
  isNegativeDisabled: PropTypes.bool,
  onNegativeClick: PropTypes.func,
  onPositiveClick: PropTypes.func,
  onClose: PropTypes.func,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg', 'xl']),
};

EasyPlanModal.defaultProps = {
  open: false,
  onPositiveClick: () => null,
  negativeBtnText: textForKey('Close'),
  positiveBtnText: textForKey('Save'),
  positiveBtnIcon: <IconSuccess fill='#fff' />,
  className: '',
  size: 'lg',
};
