import React from 'react';
import { CircularProgress, SlideProps } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslate } from 'react-polyglot';
import styles from './BottomSheetDialog.module.scss';

const Transition = React.forwardRef<unknown, SlideProps>(function Transition(
  props,
  ref,
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

interface BottomSheetDialogProps {
  open: boolean;
  title?: string;
  canSave?: boolean;
  saveText?: string;
  isLoading?: boolean;
  onClose?: () => void;
  onSave?: () => void;
}

const BottomSheetDialog: React.FC<BottomSheetDialogProps> = ({
  open,
  title,
  children,
  canSave,
  saveText,
  isLoading,
  onClose,
  onSave,
}) => {
  const textForKey = useTranslate();
  const handleClose = () => {
    onClose?.();
  };

  const handleSave = () => {
    onSave?.();
  };

  return (
    <Dialog
      fullScreen
      className={styles.dialogRoot}
      open={open}
      onClose={handleClose}
      style={{ zIndex: 1299 }}
      TransitionComponent={Transition}
    >
      <AppBar className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            onClick={handleClose}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
          <Typography variant='h6' className={styles.title}>
            {title}
          </Typography>
          {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
          {/*@ts-ignore*/}
          <Box
            minWidth='100px'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            {isLoading ? (
              <CircularProgress className={styles.progressBar} />
            ) : (
              <Button
                color='inherit'
                disabled={!canSave}
                classes={{ disabled: styles.disabledBtn }}
                onClick={handleSave}
              >
                {saveText || textForKey('Save')}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
      {/*@ts-ignore*/}
      <Box flex='1' overflow='auto'>
        {children}
      </Box>
    </Dialog>
  );
};

export default BottomSheetDialog;
