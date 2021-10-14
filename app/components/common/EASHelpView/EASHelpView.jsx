import React, { useState } from 'react';
import clsx from "clsx";
import PropTypes from 'prop-types';
import Box from "@material-ui/core/Box";
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import Popper from '@material-ui/core/Popper';
import Typography from "@material-ui/core/Typography";
import styles from './EASHelpView.module.scss';

const EASHelpView = ({ notification, anchorEl, placement, onClose, ...rest }) => {
  const [arrowRef, setArrowRef] = useState(null);

  const handleOkClick = () => {
    onClose?.(notification);
  }

  return (
    <Popper
      {...rest}
      transition
      anchorEl={anchorEl}
      placement={placement}
      style={{ zIndex: 10000 }}
      modifiers={{
        arrow: {
          enabled: true,
          element: arrowRef
        }
      }}
      className={clsx(styles.helpView, styles[placement])}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <>
            <span className={styles.arrow} ref={setArrowRef} />
            <Paper className={styles.paper}>
              <Box
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
                justifyContent="center"
              >
                <Typography className={styles.title}>
                  {notification.title}
                </Typography>
                <Typography className={styles.message}>
                  {notification.message}
                </Typography>
                <Button className={styles.closeBtn} onPointerUp={handleOkClick}>OK</Button>
              </Box>
            </Paper>
          </>
        </Fade>
      )}
    </Popper>
  );
};

export default EASHelpView;

EASHelpView.propTypes = {
  open: PropTypes.bool,
  notification: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
  }),
  anchorEl: PropTypes.any,
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  onClose: PropTypes.func,
};

EASHelpView.defaultProps = {
  placement: 'bottom',
};
