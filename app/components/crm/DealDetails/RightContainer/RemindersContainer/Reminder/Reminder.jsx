import React from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import ReminderIcon from '@material-ui/icons/AccessTime';
import { textForKey } from "../../../../../../utils/localization";
import getReminderTexts from "../../../../../../utils/getReminderTexts";
import styles from './Reminder.module.scss';

const Reminder = ({ reminder }) => {
  const { isToday, timeText, assigneeName } = getReminderTexts(reminder);

  return (
    <div className={clsx(
      styles.reminder,
      {
        [styles.active]: isToday,
        [styles.expired]: reminder.active,
        [styles.pending]: !isToday && !reminder.active,
      }
    )}>
      <Typography className={styles.reminderDate}>
        <ReminderIcon/>
        {timeText}
      </Typography>
      <Typography className={styles.detailsRow}>
        {textForKey('crm_reminder_for')}:
        <span style={{ fontWeight: 'bold', marginLeft: 5 }}>
          {assigneeName}
        </span>
      </Typography>
      <Typography className={styles.detailsRow}>
        {textForKey('crm_reminder_type')}:
        <span style={{ fontWeight: 'bold', marginLeft: 5 }}>
          {textForKey(`crm_reminder_type_${reminder.type}`)}
        </span>
      </Typography>
      {reminder.comment ? (
        <Typography className={styles.commentLabel}>
          {reminder.comment}
        </Typography>
      ) : null}
    </div>
  );
};

export default Reminder;

Reminder.propTypes = {
  reminder: PropTypes.shape({
    active: PropTypes.bool,
    assignee: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    comment: PropTypes.string,
    completed: PropTypes.bool,
    created: PropTypes.string,
    createdBy: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    dueDate: PropTypes.string,
    endDate: PropTypes.string,
    id: PropTypes.number,
    lastUpdated: PropTypes.string,
    type: PropTypes.string,
  }),
};
