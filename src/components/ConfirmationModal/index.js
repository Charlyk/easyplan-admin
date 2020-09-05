import React from 'react';

import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

import './styles.scss';
import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import { textForKey } from '../../utils/localization';
import LoadingButton from '../LoadingButton';

const ConfirmationModal = props => {
  const { title, message, onConfirm, onClose, isLoading } = props;
  return (
    <Modal {...props} centered onHide={onClose} className='confirmation-modal'>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
        <div className='close-btn' onClick={onClose}>
          <IconClose />
        </div>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button className='cancel' onClick={onClose}>
          {textForKey('Close')}
          <IconClose />
        </Button>
        <LoadingButton
          showLoading={isLoading}
          className='save'
          onClick={onConfirm}
        >
          {textForKey('Confirm')}
          {!isLoading && <IconSuccess />}
        </LoadingButton>
      </Modal.Footer>
    </Modal>
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
