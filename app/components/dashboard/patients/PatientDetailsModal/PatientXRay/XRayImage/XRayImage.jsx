import React from "react";
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

import urlToLambda from "../../../../../../../utils/urlToLambda";
import IconTrash from "../../../../../icons/iconTrash";
import styles from "./XRayImage.module.scss";

const XRayImage = ({ image, onImageClick, onImageDelete }) => {

  const handleImageClick = () => {
    onImageClick?.(image)
  }

  const handleImageDelete = (event) => {
    event.stopPropagation();
    onImageDelete?.(image);
  }

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
        <img
          className={styles.image}
          key={image.id}
          src={urlToLambda(image.imageUrl, 150)}
          alt='X-Ray'
        />
        <IconButton
          classes={{ root: styles.trashButton }}
          onPointerUp={handleImageDelete}
        >
          <IconTrash/>
        </IconButton>
      </div>
    </Grid>
  )
}

export default XRayImage
