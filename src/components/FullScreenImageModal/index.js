import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Modal, Spinner } from 'react-bootstrap';
import './FullScreenImageModal.module.scss';

const FullScreenImageModal = ({ open, imageUrl, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Modal centered className='image-modal-root' show={open} onHide={onClose}>
      <Modal.Body>
        {isLoading && (
          <Spinner animation='border' className='image-loading-spinner' />
        )}
        <img
          src={imageUrl}
          alt='Full screen'
          onLoad={() => setIsLoading(false)}
        />
      </Modal.Body>
    </Modal>
  );
};

FullScreenImageModal.propTypes = {
  open: PropTypes.bool,
  imageUrl: PropTypes.string,
  onClose: PropTypes.func,
};

FullScreenImageModal.defaultProps = {
  onClose: () => null,
};

export default FullScreenImageModal;
