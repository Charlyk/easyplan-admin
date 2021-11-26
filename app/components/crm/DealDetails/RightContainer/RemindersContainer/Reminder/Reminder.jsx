import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import ReminderIcon from '@material-ui/icons/AccessTime';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import EASTextarea from 'app/components/common/EASTextarea';
import LoadingButton from 'app/components/common/LoadingButton';
import getReminderTexts from 'app/utils/getReminderTexts';
import { textForKey } from 'app/utils/localization';
import { requestCompleteReminder } from 'middleware/api/crm';
import onRequestError from 'app/utils/onRequestError';
import styles from './Reminder.module.scss';

const Reminder = ({ reminder }) => {
  const [resultComment, setResultComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isToday, timeText, assigneeName } = getReminderTexts(reminder);

  const handleCompleteReminder = async () => {
    if (isLoading || resultComment.trim().length === 0) {
      return;
    }
    try {
      setIsLoading(true);
      await requestCompleteReminder(reminder.id, resultComment);
    } catch (error) {
      onRequestError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={clsx(styles.reminder, {
        [styles.active]: isToday,
        [styles.expired]: reminder.active,
        [styles.pending]: !isToday && !reminder.active,
      })}
    >
      <Typography className={styles.reminderDate}>
        <ReminderIcon />
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
      {!reminder.completed ? (
        <>
          <EASTextarea
            rows={3}
            maxRows={3}
            value={resultComment}
            onChange={setResultComment}
            containerClass={styles.resultField}
            placeholder={textForKey('crm_reminder_enter_result')}
          />
          <LoadingButton
            isLoading={isLoading}
            disabled={resultComment.trim().length === 0}
            className={styles.completeBtn}
            onClick={handleCompleteReminder}
          >
            {textForKey('crm_reminder_complete')}
          </LoadingButton>
        </>
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
