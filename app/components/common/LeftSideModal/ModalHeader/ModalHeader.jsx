import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconArrowNext from '../../../icons/iconArrowNext';
import IconClose from '../../../icons/iconClose';
import styles from './ModalHeader.module.scss';

const ModalHeader = props => {
  const { onClose, title, steps } = props;
  return (
    <div className={styles.header}>
      <div className={styles.closeContainer}>
        <div className={styles.closeBtn} role='button' tabIndex={0} onClick={onClose}>
          <IconClose />
        </div>
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.breadcrumbContainer}>
        {steps?.map((step, index) => {
          const isLast = index === steps.length - 1;
          const classes = clsx(
            styles.breadcrumb,
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
