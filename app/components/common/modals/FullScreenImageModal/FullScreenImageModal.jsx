import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from "@material-ui/core/CircularProgress";
import EASModal from "../EASModal";
import styles from './FullScreenImageModal.module.scss'
import urlToLambda from "../../../../utils/urlToLambda";
import EASImage from "../../EASImage";

const FullScreenImageModal = ({ open, imageUrl, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
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
