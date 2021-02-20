import React from 'react';

import { Popper, Paper, Fade, ClickAwayListener } from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './ActionsSheet.module.scss';
import clsx from "clsx";

const ActionsSheet = props => {
  const { actions, onSelect, onClose, placement } = props;

  const handleActionClick = action => onSelect(action);

  return (
    <Popper {...props} placement={placement} style={{ zIndex: 999 }} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={styles['actions-sheet__paper']}>
            <ClickAwayListener onClickAway={onClose}>
              <div>
                {actions.map(action => (
                  <div
                    role='button'
                    tabIndex={0}
                    onClick={() => handleActionClick(action)}
                    className={clsx(styles['actions-sheet__item'], action.type)}
                    key={action.key}
                  >
                    {action.icon}
                    {action.name}
                  </div>
                ))}
              </div>
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
