import React, { useRef } from 'react';
import clsx from 'clsx';
import IconEdit from 'app/components/icons/iconEdit';
import IconPlus from 'app/components/icons/iconPlus';
import EASImage from '../EASImage';
import styles from './UploadAvatar.module.scss';

const UploadAvatar = ({ currentAvatar, className, placeholder, onChange }) => {
  const inputRef = useRef(null);
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    onChange?.(file);
  };

  const handleIconClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={clsx(styles.uploadAvatar, className)}>
      <div className={styles.avatarWrapper} onPointerUp={handleIconClick}>
        <EASImage
          enableLoading
          src={currentAvatar}
          className={styles.imageRoot}
          placeholder={placeholder}
        />

        <div className={styles.iconContainer}>
          {currentAvatar ? <IconEdit fill='#fff' /> : <IconPlus fill='#fff' />}
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
  );
};

export default UploadAvatar;
