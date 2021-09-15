import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import PropTypes from 'prop-types';
import { Calendar } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';

import { getAppLanguage } from '../../../utils/localization';
import styles from '../../../styles/EasyDatePicker.module.scss';

const EasyDatePicker = ({
  open,
  pickerAnchor,
  placement,
  minDate,
  onClose,
  onChange,
  selectedDate,
  disablePortal,
}) => {
  return (
    <Popper
      className={styles['easy-date-picker']}
      anchorEl={pickerAnchor}
      open={open}
      disablePortal={disablePortal}
      placement={placement}
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={styles['calendar-paper']}>
            <ClickAwayListener onClickAway={onClose}>
              <Calendar
                minDate={minDate}
                locale={locales[getAppLanguage()]}
                onChange={onChange}
                date={selectedDate}
              />
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default EasyDatePicker;

EasyDatePicker.propTypes = {
  open: PropTypes.bool,
  selectedDate: PropTypes.instanceOf(Date),
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  pickerAnchor: PropTypes.any,
  minDate: PropTypes.instanceOf(Date),
  placement: PropTypes.oneOf(['bottom', 'top']),
  disablePortal: PropTypes.bool,
};

EasyDatePicker.defaultProps = {
  selectedDate: new Date(),
  placement: 'bottom',
  disablePortal: true,
};
