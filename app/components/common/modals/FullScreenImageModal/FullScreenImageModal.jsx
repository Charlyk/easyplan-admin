import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from './FullScreenImageModal.module.scss';

const FullScreenImageModal = ({ open, imageUrl, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Modal centered className={styles['image-modal-root']} open={open} onHide={onClose}>
      <Paper>
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
      </Paper>
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
