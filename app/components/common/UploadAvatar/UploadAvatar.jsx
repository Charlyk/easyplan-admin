import React, { useCallback, useMemo, useRef } from "react";
import clsx from "clsx";
import Box from "@material-ui/core/Box";
import IconAvatar from "../../icons/iconAvatar";
import IconEdit from "../../icons/iconEdit";
import IconPlus from "../../icons/iconPlus";
import styles from './UploadAvatar.module.scss';

const UploadAvatar = ({ currentAvatar, className, placeholder, onChange }) => {
  const inputRef = useRef(null);
  const imageRef = useRef(null);

  const updateImagePreview = useCallback((reader) => {
    if (imageRef.current != null) {
      imageRef.current.src = reader.target.result;
    }
  }, [imageRef.current]);

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
      imageRef.current.src = currentAvatar;
    }
  }, [currentAvatar, updateImagePreview]);

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
          <img ref={imageRef} alt="Avatar image"/>
        ) : (
          placeholder || <IconAvatar />
        )}
        <div className={styles.iconContainer}>
          {currentAvatar ? (
            <IconEdit fill='#fff' />
          ) : (
            <IconPlus fill='#fff' />
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
