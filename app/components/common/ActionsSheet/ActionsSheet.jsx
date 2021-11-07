import React from 'react';
import clsx from "clsx";
import PropTypes from 'prop-types';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import styles from './ActionsSheet.module.scss';
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Typography from "@material-ui/core/Typography";

const ActionsSheet = props => {
  const { actions, onSelect, onClose, placement } = props;

  const handleActionClick = (action, event) => {
    event.stopPropagation();
    onSelect(action);
  }

  return (
    <Popper
      {...props}
      transition
      placement={placement}
      style={{ zIndex: 999 }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={styles.actionsSheet}>
            <ClickAwayListener onClickAway={onClose}>
              <MenuList>
                {actions.map(action => (
                  <MenuItem
                    key={action.key}
                    className={styles.item}
                    onClick={(event) => handleActionClick(action, event)}
                  >
                    {action.icon}
                    <Typography className={clsx(styles.label, styles[action.type])}>
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
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      key: PropTypes.string,
      icon: PropTypes.any,
      type: PropTypes.oneOf(['default', 'destructive']),
    }),
  ).isRequired,
  placement: PropTypes.oneOf(['bottom', 'bottom-end', 'bottom-start']),
  onSelect: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

ActionsSheet.defaultProps = {
  placement: 'bottom',
};
