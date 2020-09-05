import React from 'react';

import PropTypes from 'prop-types';
import './styles.scss';
import { Popper, Paper, Fade, ClickAwayListener } from '@material-ui/core';

const ActionsSheet = props => {
  const { actions, onSelect, onClose } = props;

  const handleActionClick = action => onSelect(action);

  return (
    <Popper {...props} placement='bottom' transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className='actions-sheet__paper'>
            <ClickAwayListener onClickAway={onClose}>
              <div>
                {actions.map(action => (
                  <div
                    onClick={() => handleActionClick(action)}
                    className={`actions-sheet__item ${action.type}`}
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
  onSelect: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};
