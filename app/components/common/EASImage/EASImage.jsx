import React, { useCallback, useEffect, useReducer } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import remoteImageToBase64 from 'app/utils/remoteImageToBase64';
import urlToLambda from 'app/utils/urlToLambda';
import styles from './EASImage.module.scss';
import reducer, {
  initialState,
  setIsError,
  setImageContent,
  setIsLoading,
  setIsAttached,
} from './EASImage.reducer';

const EASImage = ({ src, classes, className, placeholder, enableLoading }) => {
  const [{ isLoading, imageContent, isError, isAttached }, localDispatch] =
    useReducer(reducer, initialState);

  const downloadImageAndSetContent = useCallback(async () => {
    if (src == null) {
      return;
    }
    try {
      if (!isAttached) return;
      localDispatch(setIsLoading(true));
      const imageData = await remoteImageToBase64(urlToLambda(src));
      if (!isAttached) return;
      localDispatch(setImageContent(imageData));
    } catch (error) {
      console.error(error);
      if (!isAttached) return;
      localDispatch(setIsError(true));
    }
  }, [src, isAttached]);

  const updateImageContent = useCallback(() => {
    if (src == null) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', (reader) => {
      if (!isAttached) return;
      localDispatch(setImageContent(reader.target.result));
    });
    reader.readAsDataURL(src);
  }, [src, isAttached]);

  useEffect(() => {
    localDispatch(setIsAttached(true));
    return () => {
      localDispatch(setIsAttached(false));
    };
  }, []);

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
        alt='Loading'
        src={imageContent}
        className={clsx(styles.image, classes?.image, {
          [styles.loading]: isLoading || isError || imageContent == null,
        })}
      />
      {(isError || imageContent == null) &&
        (placeholder || <div className={styles.placeholderRect} />)}
      {isLoading && enableLoading && (
        <div className={styles.progressBarWrapper}>
          <CircularProgress
            className={clsx(styles.progressBar, classes?.loader)}
          />
        </div>
      )}
    </div>
  );
};

EASImage.propTypes = {
  src: PropTypes.any,
  placeholder: PropTypes.any,
  enableLoading: PropTypes.bool,
  classes: PropTypes.shape({
    root: PropTypes.any,
    image: PropTypes.any,
    loader: PropTypes.any,
  }),
  className: PropTypes.any,
};

EASImage.defaultProps = {
  enableLoading: false,
};

export default EASImage;
