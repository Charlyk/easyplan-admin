import React from 'react';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import XRayImage from '../XRayImage';
import styles from './XRayPhase.module.scss';

const XRayPhase = ({
  title,
  images,
  isExpanded,
  onDeleteImage,
  onImageClick,
}) => {
  const handleImageClick = (image) => {
    onImageClick?.(image);
  };

  const handleDeleteImage = (image) => {
    onDeleteImage?.(image);
  };

  return (
    <div className={clsx(styles.phase, isExpanded && styles.expanded)}>
      <div className={styles.phaseHeader}>{title}</div>
      <div className={styles.phaseImages}>
        <Grid container>
          {images.map((image) => (
            <XRayImage
              key={image.id}
              image={image}
              onImageClick={handleImageClick}
              onImageDelete={handleDeleteImage}
            />
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default XRayPhase;

XRayPhase.propTypes = {
  title: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      imageUrl: PropTypes.string,
      imageType: PropTypes.string,
      created: PropTypes.string,
      createdBy: PropTypes.string,
    }),
  ),
  isExpanded: PropTypes.bool,
  phaseId: PropTypes.oneOf(['Initial', 'Middle', 'Final']),
  onExpand: PropTypes.func,
  onImageClick: PropTypes.func,
  onDeleteImage: PropTypes.func,
};

XRayPhase.defaultProps = {
  onExpand: () => null,
  images: [],
};
