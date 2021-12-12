import React from 'react';
import PropTypes from 'prop-types';
import EASImage from 'app/components/common/EASImage';
import EASModal from 'app/components/common/modals/EASModal';
import styles from './FullScreenImageModal.module.scss';

const FullScreenImageModal = ({ open, imageUrl, onClose }) => {
  return (
    <EASModal
      open={open}
      onClose={onClose}
      className={styles.imageModalRoot}
      paperClass={styles.modalPaper}
    >
      <div className={styles.modalContent}>
        <EASImage src={imageUrl} />
      </div>
    </EASModal>
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
