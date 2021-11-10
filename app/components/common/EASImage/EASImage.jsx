import React, { useCallback, useEffect, useReducer } from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import CircularProgress from "@material-ui/core/CircularProgress";
import remoteImageToBase64 from "../../../utils/remoteImageToBase64";
import reducer, {
  initialState,
  setIsError,
  setImageContent,
  setIsLoading
} from './EASImage.reducer';
import styles from './EASImage.module.scss';
import urlToLambda from "../../../utils/urlToLambda";
import IconAvatar from "../../icons/iconAvatar";

const EASImage = ({ src, classes, className, placeholder }) => {
  const [{ isLoading, imageContent, isError }, localDispatch] = useReducer(reducer, initialState);

  const downloadImageAndSetContent = useCallback(async () => {
    if (src == null) {
      return;
    }
    try {
      localDispatch(setIsLoading(true));
      const imageData = await remoteImageToBase64(urlToLambda(src));
      localDispatch(setImageContent(imageData));
    } catch (error) {
      localDispatch(setIsError(true));
    }
  }, [src]);

  const updateImageContent = useCallback(() => {
    if (src == null) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', (reader) => {
      localDispatch(setImageContent(reader.target.result));
    })
    reader.readAsDataURL(src);
  }, [src]);

  useEffect(() => {
    if (src == null) {
      return;
    }

    if (typeof src === 'object') {
      updateImageContent();
    } else {
      downloadImageAndSetContent();
    }
  }, [src, downloadImageAndSetContent, updateImageContent]);

  return (
    <div className={clsx(styles.easImage, className, classes?.root)}>
      <img
        alt="Loading image"
        src={imageContent}
        className={clsx(
          styles.image,
          classes?.image,
          {
            [styles.loading]: isLoading || isError || imageContent == null
          }
        )}
      />
      {(isError || imageContent == null) && (
        placeholder || <IconAvatar />
      )}
      {isLoading && (
        <div className={styles.progressBarWrapper}>
          <CircularProgress className={styles.progressBar}/>
        </div>
      )}
    </div>
  )
};

EASImage.propTypes = {
  src: PropTypes.any,
  placeholder: PropTypes.any,
  classes: PropTypes.shape({
    root: PropTypes.any,
    image: PropTypes.any,
  }),
  className: PropTypes.any
}

export default EASImage;
