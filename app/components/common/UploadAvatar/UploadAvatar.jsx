import React, { useCallback, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import IconAvatar from "../../icons/iconAvatar";
import IconEdit from "../../icons/iconEdit";
import IconPlus from "../../icons/iconPlus";
import styles from './UploadAvatar.module.scss';
import urlToLambda from "../../../utils/urlToLambda";
import { CircularProgress } from "@material-ui/core";

const UploadAvatar = ({ currentAvatar, className, placeholder, onChange }) => {
  const inputRef = useRef(null);
  const imageRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateImagePreview = useCallback((reader) => {
    if (imageRef.current != null) {
      setIsLoading(true)
      imageRef.current.onload = () => {
        setIsLoading(false)
      }
      imageRef.current.src = reader.target.result;
    }
  }, [imageRef.current]);

  const handleHideLoading = useCallback(() => {
    setIsLoading(false)
  }, []);

  useMemo(() => {
    if (currentAvatar == null) {
      return;
    }
    if (typeof currentAvatar === 'object') {
      const reader = new FileReader();
      reader.addEventListener('load', updateImagePreview)
      reader.readAsDataURL(currentAvatar);
      return () => reader.removeEventListener('load', updateImagePreview);
    } else if (imageRef.current != null) {
      setIsLoading(true)
      imageRef.current.onload = handleHideLoading;
      imageRef.current.onerror = handleHideLoading;
      imageRef.current.src = urlToLambda(currentAvatar);
    }
  }, [currentAvatar, updateImagePreview, handleHideLoading]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    onChange?.(file);
  };

  const handleIconClick = () => {
    inputRef.current?.click();
  }

  return (
    <div className={clsx(styles.uploadAvatar, className)}>
      <div
        className={styles.avatarWrapper}
        onPointerUp={handleIconClick}
      >
        {currentAvatar ? (
          <img ref={imageRef} alt="Avatar image" style={{ display: isLoading ? 'none' : 'initial' }}/>
        ) : (
          placeholder || <IconAvatar/>
        )}
        {isLoading && (
          <CircularProgress className="circular-progress-bar"/>
        )}
        <div className={styles.iconContainer}>
          {currentAvatar ? (
            <IconEdit fill='#fff'/>
          ) : (
            <IconPlus fill='#fff'/>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        className='custom-file-button'
        type='file'
        name='avatar-file'
        id='avatar-file'
        accept='.jpg,.jpeg,.png'
        onChange={handleAvatarChange}
      />
    </div>
  )
}

export default UploadAvatar;
