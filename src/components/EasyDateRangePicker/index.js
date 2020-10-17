import React from 'react';

import { ClickAwayListener, Fade, Paper } from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';

import { getAppLanguage } from '../../utils/localization';

import './styles.scss';
import { localizedInputRanges, localizedStaticRanges } from './ranges';

const EasyDateRangePicker = ({
  pickerAnchor,
  open,
  dateRange,
  onClose,
  onChange,
}) => {
  return (
    <Popper
      className='easy-date-range-picker'
      anchorEl={pickerAnchor}
      open={open}
      disablePortal
      placement='bottom'
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className='calendar-paper'>
            <ClickAwayListener onClickAway={onClose}>
              <DateRangePicker
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
