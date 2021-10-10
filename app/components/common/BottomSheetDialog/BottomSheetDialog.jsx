import React from "react";
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import { textForKey } from "../../../utils/localization";
import styles from './BottomSheetDialog.module.scss';
import { CircularProgress } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BottomSheetDialog = ({ open, title, children, canSave, isLoading, onClose, onSave }) => {
  const handleClose = () => {
    onClose?.();
  };

  const handleSave = () => {
    onSave?.();
  }

  return (
    <Dialog
      fullScreen
      className={styles.dialogRoot}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={styles.title}>
            {title}
          </Typography>
          <Box
            minWidth="100px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {isLoading ? (
              <CircularProgress className={styles.progressBar} />
            ) : canSave ? (
              <Button autoFocus color="inherit" onClick={handleSave}>
                {textForKey('Save')}
              </Button>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>
      <Box flex="1" overflow="auto">
        {children}
      </Box>
    </Dialog>
  );
};

export default BottomSheetDialog;

BottomSheetDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  canSave: PropTypes.bool,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.any,
  onClose: PropTypes.func,
};

BottomSheetDialog.defaultProps = {
  isLoading: false,
  canSave: true,
};