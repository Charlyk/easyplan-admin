import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconArrowNext from '../../assets/icons/iconArrowNext';
import IconClose from '../../assets/icons/iconClose';

const ModalHeader = props => {
  const { onClose, title, steps } = props;
  return (
    <div className='left-side-modal__header'>
      <div className='left-side-modal__header__close-container'>
        <div className='close-btn' role='button' tabIndex={0} onClick={onClose}>
          <IconClose />
        </div>
      </div>
      <div className='left-side-modal__header__title'>{title}</div>
      <div className='left-side-modal__header__breadcrumb-container'>
        {steps?.map((step, index) => {
          const isLast = index === steps.length - 1;
          const classes = clsx(
            'left-side-modal__header__breadcrumb',
            !isLast && 'current',
          );
          return (
            <div key={step} className={classes}>
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
