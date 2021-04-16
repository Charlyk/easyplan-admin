import React from "react";
import PropTypes from 'prop-types';
import { Fade, Popper, Typography } from "@material-ui/core";
import { Statuses } from "../../../../../utils/constants";
import { textForKey } from "../../../../../utils/localization";
import styles from './CalendarLegend.module.scss'

const StatusItem = ({ item }) => {
  return (
    <div className={styles.statusItem}>
      <div className={styles.colorIndicator} style={{ backgroundColor: item.color }} />
      <Typography className={styles.statusName}>{item.name}</Typography>
    </div>
  )
}

const CalendarLegend = ({ open, anchorEl, placement }) => {
  const scheduleStatuses = Statuses.filter(item => item.isSchedule);
  return (
    <Popper
      disablePortal
      open={open}
      anchorEl={anchorEl.current}
      placement={placement}
      style={{ zIndex: 100000 }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <div className={styles.calendarLegend}>
            <Typography className={styles.titleLabel}>
              {textForKey('Calendar legend')}
            </Typography>
            {scheduleStatuses.map(status => (
              <StatusItem key={status.id} item={status}/>
            ))}
          </div>
        </Fade>
      )}
    </Popper>
  )
}

export default CalendarLegend

StatusItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    color: PropTypes.string,
    icon: PropTypes.any,
    statusIcon: PropTypes.any ,
    manual: PropTypes.bool,
    isSchedule: PropTypes.bool,
  }),
}

CalendarLegend.propTypes = {
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.any.isRequired,
  placement: PropTypes.oneOf([
    'bottom',
    'bottom-start',
    'bottom-end',
    'top',
    'top-start',
    'top-end',
    'left-start',
    'left-end',
    'right-start',
    'right-end',
  ]),
}

CalendarLegend.defaultProps = {
  placement: 'bottom'
}
