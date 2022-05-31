import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import IconClose from 'app/components/icons/iconClose';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { textForKey } from 'app/utils/localization';
import styles from './EASModal.module.scss';

interface Props {
  open: boolean;
  title: string;
  size?: 'small' | 'medium' | 'large' | 'unset';
  destroyBtnText?: string;
  primaryBtnText?: string;
  secondaryBtnText?: string;
  hidePositiveBtn?: boolean;
  isDestroyLoading?: boolean;
  isPositiveLoading?: boolean;
  className?: string;
  bodyStyle?: any;
  paperClass?: string;
  children?: any;
  isPositiveDisabled?: any;
  isDestroyDisabled?: boolean | null;
  note?: boolean | string | JSX.Element;
  onClose: () => void;
  onDestroyClick?: () => void;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  onBackdropClick?: () => void;
}

const EASModal: React.FC<Props> = ({
  open,
  title,
  size = 'small',
  destroyBtnText = textForKey('Delete'),
  primaryBtnText = textForKey('Save'),
  secondaryBtnText = textForKey('Close'),
  hidePositiveBtn,
  isPositiveLoading,
  isPositiveDisabled,
  isDestroyDisabled = null,
  bodyStyle,
  note,
  children,
  className,
  paperClass,
  onClose,
  onDestroyClick,
  onPrimaryClick,
  onSecondaryClick,
  onBackdropClick,
}) => {
  const showDestroyBtn = typeof onDestroyClick === 'function';

  const handleCloseModal = (event) => {
    event?.stopPropagation();
    if (isPositiveLoading) {
      return;
    }

    onClose?.();
  };

  const handlePrimaryClick = (event) => {
    event?.stopPropagation();
    if (isPositiveDisabled) {
      return;
    }

    if (typeof onPrimaryClick === 'function') {
      onPrimaryClick();
    } else {
      onClose?.();
    }
  };

  const handleDestroyClick = (event) => {
    event?.stopPropagation();
    if (typeof onDestroyClick === 'function') {
      onDestroyClick();
    } else {
      onClose?.();
    }
  };

  const handleSecondaryClick = (event) => {
    event?.stopPropagation();
    if (typeof onSecondaryClick === 'function') {
      onSecondaryClick();
    } else {
      onClose?.();
    }
  };

  const handleBackdropClick = (event, reason) => {
    if (reason === 'backdropClick' && typeof onBackdropClick === 'function') {
      onBackdropClick?.();
    } else {
      onClose?.();
    }
  };

  return (
    <Modal
      open={open}
      className={clsx(styles.modalRoot, className)}
      onClose={handleBackdropClick}
    >
      <Paper className={clsx(styles.modalPaper, styles[size], paperClass)}>
        <div className={styles.modalHeader}>
          <Typography className={styles.titleLabel} noWrap>
            {title}
          </Typography>
          <IconButton className={styles.closeButton} onClick={handleCloseModal}>
            <IconClose />
          </IconButton>
        </div>
        <div className={styles.modalBody} style={bodyStyle}>
          {children}
        </div>
        <div className={styles.modalFooter}>
          {note && <Typography className={styles.noteLabel}>{note}</Typography>}
          {!isPositiveLoading && (
            <Button
              className={styles.secondaryButton}
              onClick={handleSecondaryClick}
              variant='text'
            >
              {secondaryBtnText}
            </Button>
          )}
          {!isPositiveLoading && showDestroyBtn && (
            <Button
              onClick={handleDestroyClick}
              disabled={
                isDestroyDisabled == null
                  ? isPositiveDisabled
                  : isDestroyDisabled
              }
              variant='text'
              classes={{
                root: styles.destroyButton,
                disabled: styles.buttonDisabled,
              }}
            >
              {destroyBtnText}
            </Button>
          )}
          {!hidePositiveBtn && (
            <Button
              onClick={handlePrimaryClick}
              disabled={isPositiveDisabled}
              variant='text'
              classes={{
                root: styles.primaryButton,
                disabled: styles.buttonDisabled,
              }}
            >
              {isPositiveLoading ? (
                <CircularProgress
                  className={clsx('circular-progress-bar', styles.progressBar)}
                />
              ) : (
                primaryBtnText
              )}
            </Button>
          )}
        </div>
      </Paper>
    </Modal>
  );
};

export default React.memo(EASModal, areComponentPropsEqual);
