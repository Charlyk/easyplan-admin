import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import EASImage from 'app/components/common/EASImage';
import IconTrash from 'app/components/icons/iconTrash';
import styles from './XRayImage.module.scss';

const XRayImage = ({ image, onImageClick, onImageDelete }) => {
  const handleImageClick = () => {
    onImageClick?.(image);
  };

  const handleImageDelete = (event) => {
    event.stopPropagation();
    onImageDelete?.(image);
  };

  return (
    <Grid
      item
      className={styles.xRayImageRoot}
      xs={4}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '.2rem',
      }}
    >
      <div
        style={{ outline: 'none', position: 'relative' }}
        role='button'
        tabIndex={0}
        onPointerUp={handleImageClick}
      >
        <EASImage
          enableLoading
          src={image.thumbnailUrl}
          classes={{
            root: styles.imageContainer,
            loader: styles.imageProgress,
          }}
        />
        <IconButton
          classes={{ root: styles.trashButton }}
          onPointerUp={handleImageDelete}
        >
          <IconTrash />
        </IconButton>
      </div>
    </Grid>
  );
};

export default XRayImage;

XRayImage.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.number,
    imageUrl: PropTypes.string,
    thumbnailUrl: PropTypes.string,
  }),
  onImageClick: PropTypes.func,
  onImageDelete: PropTypes.func,
};
