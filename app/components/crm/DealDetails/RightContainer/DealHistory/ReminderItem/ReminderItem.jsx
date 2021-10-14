import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import DoneIcon from '@material-ui/icons/CheckCircleOutline';
import { requestCompleteReminder } from "../../../../../../../middleware/api/crm";
import getReminderTexts from "../../../../../../utils/getReminderTexts";
import onRequestError from "../../../../../../utils/onRequestError";
import { textForKey } from "../../../../../../utils/localization";
import LoadingButton from "../../../../../common/LoadingButton";
import EASTextarea from "../../../../../common/EASTextarea";
import styles from './ReminderItem.module.scss';

const ReminderItem = ({ reminder }) => {
  const [resultComment, setResultComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { headerText } = getReminderTexts(reminder);
  const completedBy = `${reminder.completedBy?.firstName} ${reminder.completedBy?.lastName}`;

  const handleCompleteReminder = async () => {
    if (isLoading || resultComment.length === 0) {
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
    <div className={clsx(
      styles.reminderItem,
      {
        [styles.expired]: reminder.active,
        [styles.completed]: reminder.completed
      }
    )}>
      {reminder.completed ? (
        <DoneIcon />
      ) : (
        <img src="/icons-alarm-80.png" alt="Reminder"/>
      )}
      <div className={styles.dataWrapper}>
        <Typography className={styles.dateText}>{headerText}</Typography>
        <Typography className={clsx(styles.noteText, styles.typeText)}>
          {textForKey(`crm_reminder_type_${reminder.type}`)}: {reminder.comment ? `${reminder.comment}` : ''}
        </Typography>
        {reminder.completed ? (
          <Typography className={styles.noteText}>
            {completedBy}: {reminder.resultComment}
          </Typography>
        ) : (
          <div className={styles.resultContainer}>
            <EASTextarea
              rows={2}
              maxRows={4}
              value={resultComment}
              containerClass={styles.resultField}
              placeholder={textForKey('crm_reminder_enter_result')}
              onChange={setResultComment}
            />
            <LoadingButton
              isLoading={isLoading}
              disabled={resultComment.length === 0 || isLoading}
              className={styles.completeButton}
              onClick={handleCompleteReminder}
            >
              {textForKey('crm_reminder_complete')}
            </LoadingButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderItem;

ReminderItem.propTypes = {
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
    completedBy: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    dueDate: PropTypes.string,
    endDate: PropTypes.string,
    id: PropTypes.number,
    lastUpdated: PropTypes.string,
    type: PropTypes.string,
    resultComment: PropTypes.string,
  }),
}
