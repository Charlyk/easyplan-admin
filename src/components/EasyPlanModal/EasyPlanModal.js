import React from 'react';

import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import { textForKey } from '../../utils/localization';
import './styles.scss';
import LoadingButton from '../LoadingButton';

const EasyPlanModal = ({
  open,
  title,
  children,
  negativeBtnText,
  positiveBtnText,
  isPositiveDisabled,
  isNegativeDisabled,
  isPositiveLoading,
  isNegativeLoading,
  className,
  onPositiveClick,
  onNegativeClick,
  onClose,
}) => {
  return (
    <Modal
      centered
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
      <Modal.Body>{children}</Modal.Body>
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
        <LoadingButton
          disabled={isPositiveDisabled}
          isLoading={isPositiveLoading}
          className='positive-button'
          onClick={onPositiveClick}
        >
          {positiveBtnText}
          {!isPositiveLoading && <IconSuccess />}
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};

export default EasyPlanModal;

EasyPlanModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.any,
  negativeBtnText: PropTypes.string,
  positiveBtnText: PropTypes.string,
  isPositiveLoading: PropTypes.bool,
  isNegativeLoading: PropTypes.bool,
  isPositiveDisabled: PropTypes.bool,
  isNegativeDisabled: PropTypes.bool,
  onNegativeClick: PropTypes.func,
  onPositiveClick: PropTypes.func,
  onClose: PropTypes.func,
  className: PropTypes.string,
};

EasyPlanModal.defaultProps = {
  open: false,
  onPositiveClick: () => null,
  negativeBtnText: textForKey('Close'),
  positiveBtnText: textForKey('Save'),
  className: '',
};
