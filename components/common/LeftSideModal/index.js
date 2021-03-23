import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import styles from '../../../styles/LeftSideModal.module.scss';
import ModalHeader from './ModalHeader';

const LeftSideModal = (props) => {
  const { show, onClose, children, title, steps } = props;
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (show) {
      setIsHidden(false);
    } else {
      setTimeout(() => {
        setIsHidden(true);
      }, 310);
    }
  }, [show]);

  const contentClasses = clsx(
    styles['left-side-modal__content'],
    show ? styles.show : styles.hide,
  );

  const backdropClasses = clsx(
    styles['left-side-modal__backdrop'],
    show ? styles.show : styles.hide,
  );

  const mainClasses = clsx(styles['left-side-modal'], isHidden && styles.hide);

  return (
    <div className={mainClasses}>
      <div
        role='button'
        tabIndex={0}
        className={backdropClasses}
        onClick={onClose}
      />
      <div className={contentClasses}>
        <ModalHeader title={title} steps={steps} onClose={onClose} />
        {children}
      </div>
    </div>
  );
};

export default LeftSideModal;

LeftSideModal.propTypes = {
  title: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.any,
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

LeftSideModal.defaultProps = {
  onClose: () => null,
};
