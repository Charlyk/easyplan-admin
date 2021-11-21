import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';
import { getAppLanguage } from 'app/utils/localization';
import styles from './EasyDateRangePicker.module.scss';
import { localizedInputRanges, localizedStaticRanges } from './ranges';

const EasyDateRangePicker = ({
  pickerAnchor,
  open,
  dateRange,
  placement = 'bottom',
  onClose,
  onChange,
}) => {
  return (
    <Popper
      className={styles['easy-date-range-picker']}
      anchorEl={pickerAnchor}
      open={open}
      disablePortal
      placement={placement}
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper
            className={styles['calendar-paper']}
            onClick={(event) => event.stopPropagation()}
          >
            <ClickAwayListener onClickAway={onClose}>
              <DateRangePicker
                weekStartsOn={1}
                staticRanges={localizedStaticRanges}
                inputRanges={localizedInputRanges}
                onChange={onChange}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={[dateRange]}
                direction='horizontal'
                locale={locales[getAppLanguage()]}
              />
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

EasyDateRangePicker.propTypes = {
  pickerAnchor: PropTypes.any,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  dateRange: PropTypes.shape({
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
  }),
};

export default EasyDateRangePicker;
