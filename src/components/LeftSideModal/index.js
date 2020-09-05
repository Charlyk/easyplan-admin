import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import './styles.scss';

const LeftSideModal = props => {
  const { show, onClose, children } = props;
  const [isHidded, setIsHidden] = useState(true);

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
    'left-side-modal__content',
    show ? 'show' : 'hide',
  );

  const backdropClasses = clsx(
    'left-side-modal__backdrop',
    show ? 'show' : 'hide',
  );

  const mainClasses = clsx('left-side-modal', isHidded && 'hide');

  return (
    <div className={mainClasses}>
      <div className={backdropClasses} onClick={onClose} />
      <div className={contentClasses}>{children}</div>
    </div>
  );
};

export default LeftSideModal;

LeftSideModal.propTypes = {
  children: PropTypes.any,
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

LeftSideModal.defaultProps = {
  onClose: () => null,
};
