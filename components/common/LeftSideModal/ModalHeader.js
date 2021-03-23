import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconArrowNext from '../../icons/iconArrowNext';
import IconClose from '../../icons/iconClose';
import styles from '../../../styles/LeftSideModal.module.scss';

const ModalHeader = props => {
  const { onClose, title, steps } = props;
  return (
    <div className={styles['left-side-modal__header']}>
      <div className={styles['left-side-modal__header__close-container']}>
        <div className={styles['close-btn']} role='button' tabIndex={0} onClick={onClose}>
          <IconClose />
        </div>
      </div>
      <div className={styles['left-side-modal__header__title']}>{title}</div>
      <div className={styles['left-side-modal__header__breadcrumb-container']}>
        {steps?.map((step, index) => {
          const isLast = index === steps.length - 1;
          const classes = clsx(
            styles['left-side-modal__header__breadcrumb'],
            !isLast && styles.current,
          );
          return (
            <div key={`${step}-${index}`} className={classes}>
              {step}
              {!isLast && <IconArrowNext />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModalHeader;

ModalHeader.propTypes = {
  onClose: PropTypes.func,
  title: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.string),
};
