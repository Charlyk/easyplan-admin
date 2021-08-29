import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import clsx from "clsx";

import IconClose from '../../../icons/iconClose';
import IconSuccess from '../../../icons/iconSuccess';
import { textForKey } from '../../../../../utils/localization';
import LoadingButton from '../../../../../components/common/LoadingButton';
import IconTrash from "../../../icons/iconTrash";
import styles from './EasyPlanModal.module.scss';

const EasyPlanModal = (
  {
    open,
    title,
    children,
    size,
    negativeBtnText,
    positiveBtnText,
    destroyableBtnText,
    positiveBtnIcon,
    destroyableBtnIcon,
    isPositiveDisabled,
    isNegativeDisabled,
    isDestroyableDisabled,
    isPositiveLoading,
    isNegativeLoading,
    isDestroyableLoading,
    hidePositiveBtn,
    className,
    onPositiveClick,
    onNegativeClick,
    onDestroyClick,
    onClose,
  }
) => {
  return (
    <Modal
      centered
      size={size}
      className={clsx(styles['easyplan-modal-root'], styles['easyplan-modal'], className)}
      show={open}
      onHide={typeof onClose === 'function' ? onClose : () => null}
    >
      <Modal.Header>
        {title}
        {typeof onClose === 'function' && (
          <div
            role='button'
            tabIndex={0}
            className={styles['close-btn']}
            onClick={onClose}
          >
            <IconClose/>
          </div>
        )}
      </Modal.Header>
      <Modal.Body className={styles['easyplan-modal-body']}>{children}</Modal.Body>
      <Modal.Footer>
        {typeof onClose === 'function' && (
          <LoadingButton
            disabled={isNegativeDisabled}
            isLoading={isNegativeLoading}
            className='cancel-button'
            onClick={onNegativeClick || onClose}
          >
            {negativeBtnText}
            {!isNegativeLoading} <IconClose/>
          </LoadingButton>
        )}
        {typeof onDestroyClick === 'function' && (
          <LoadingButton
            disabled={isDestroyableDisabled}
            isLoading={isDestroyableLoading}
            className='delete-button'
            onClick={onNegativeClick || onClose}
          >
            {destroyableBtnText}
            {!isNegativeLoading && destroyableBtnIcon}
          </LoadingButton>
        )}
        {!hidePositiveBtn && (
          <LoadingButton
            disabled={isPositiveDisabled}
            isLoading={isPositiveLoading}
            className='positive-button'
            onClick={onPositiveClick}
          >
            {positiveBtnText}
            {!isPositiveLoading && positiveBtnIcon}
          </LoadingButton>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EasyPlanModal;

EasyPlanModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.any,
  hidePositiveBtn: PropTypes.bool,
  negativeBtnText: PropTypes.string,
  destroyableBtnText: PropTypes.string,
  positiveBtnText: PropTypes.string,
  positiveBtnIcon: PropTypes.any,
  destroyableBtnIcon: PropTypes.any,
  isPositiveLoading: PropTypes.bool,
  isNegativeLoading: PropTypes.bool,
  isDestroyableLoading: PropTypes.bool,
  isPositiveDisabled: PropTypes.bool,
  isNegativeDisabled: PropTypes.bool,
  isDestroyableDisabled: PropTypes.bool,
  onNegativeClick: PropTypes.func,
  onPositiveClick: PropTypes.func,
  onDestroyClick: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),
  onClose: PropTypes.func,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg', 'xl']),
};

EasyPlanModal.defaultProps = {
  open: false,
  onPositiveClick: () => null,
  negativeBtnText: textForKey('Close'),
  positiveBtnText: textForKey('Save'),
  destroyableBtnText: textForKey('Delete'),
  positiveBtnIcon: <IconSuccess fill='#fff'/>,
  destroyableBtnIcon: <IconTrash/>,
  className: '',
  size: 'lg',
};
