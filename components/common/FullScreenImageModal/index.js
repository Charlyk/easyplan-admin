import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from '../../../styles/FullScreenImageModal.module.scss';

const FullScreenImageModal = ({ open, imageUrl, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Modal centered className={styles['image-modal-root']} show={open} onHide={onClose}>
      <Modal.Body>
        {isLoading && (
          <div className='progress-bar-wrapper'>
            <CircularProgress className='circular-progress-bar' />
          </div>
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
