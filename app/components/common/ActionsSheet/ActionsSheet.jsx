import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './ActionsSheet.module.scss';

const ActionsSheet = (props) => {
  const { actions, onSelect, onClose, placement } = props;

  const handleActionClick = (action, event) => {
    event.stopPropagation();
    onSelect(action);
  };

  return (
    <Popper {...props} transition placement={placement} style={{ zIndex: 999 }}>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={styles.actionsSheet}>
            <ClickAwayListener onClickAway={onClose}>
              <MenuList>
                {actions.map((action) => (
                  <MenuItem
                    key={action.key}
                    className={styles.item}
                    onClick={(event) => handleActionClick(action, event)}
                  >
                    {action.icon}
                    <Typography
                      className={clsx(styles.label, styles[action.type])}
                    >
                      {action.name}
                    </Typography>
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default ActionsSheet;

ActionsSheet.propTypes = {
  open: PropTypes.bool,
  anchorEl: PropTypes.any,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      key: PropTypes.string,
      icon: PropTypes.any,
      type: PropTypes.oneOf(['default', 'destructive']),
    }),
  ).isRequired,
  placement: PropTypes.oneOf([
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
  onSelect: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

ActionsSheet.defaultProps = {
  placement: 'bottom',
};
