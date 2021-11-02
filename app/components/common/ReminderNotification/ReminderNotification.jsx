import React from "react";
import PropTypes from 'prop-types';
import upperFirst from 'lodash/upperFirst';
import Typography from "@material-ui/core/Typography";
import getReminderTexts from "../../../utils/getReminderTexts";
import { textForKey } from "../../../utils/localization";
import styles from './ReminderNotification.module.scss';

const ReminderNotification = ({ reminder }) => {
  const { isToday, timeText, createdByName } = getReminderTexts(reminder);
  return (
    <div className={styles.reminderNotification}>
      <Typography className={styles.titleLabel}>
        {textForKey('crm_new_reminder')}
      </Typography>
      <Typography className={styles.createdLabel}>
        {upperFirst(textForKey('Created by'))}: {createdByName}
      </Typography>
      <Typography className={styles.timeLabel}>{timeText}</Typography>
      <Typography className={styles.typeLabel}>
        {textForKey('crm_reminder_type')}:
        <span style={{ fontWeight: 'bold', marginLeft: 5 }}>
            {textForKey(`crm_reminder_type_${reminder.type}`)}
          {reminder.comment ? ` - ${reminder.comment}` : ''}
          </span>
      </Typography>
    </div>
  )
};

export default ReminderNotification;

ReminderNotification.propTypes = {
  reminder: PropTypes.shape({
    active: PropTypes.bool,
    assignee: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    comment: PropTypes.string,
    completed: PropTypes.bool,
    completedAt: PropTypes.string,
    completedBy: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    createdBy: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    deal: PropTypes.shape({
      id: PropTypes.number,
    }),
    dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.number,
    resultComment: PropTypes.string,
    type: PropTypes.string,
  }),
};
