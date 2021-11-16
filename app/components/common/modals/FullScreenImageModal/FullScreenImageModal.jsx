import React from 'react';
import PropTypes from 'prop-types';
import EASModal from "../EASModal";
import styles from './FullScreenImageModal.module.scss'
import EASImage from "../../EASImage";

const FullScreenImageModal = ({ open, imageUrl, onClose }) => {
  return (
    <EASModal
      open={open}
      onClose={onClose}
      className={styles.imageModalRoot}
      paperClass={styles.modalPaper}
    >
      <div className={styles.modalContent}>
        <EASImage
          src={imageUrl}
        />
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
