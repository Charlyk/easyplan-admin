import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import DoneIcon from '@material-ui/icons/CheckCircleOutline';
import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import EASTextarea from 'app/components/common/EASTextarea';
import LoadingButton from 'app/components/common/LoadingButton';
import getReminderTexts from 'app/utils/getReminderTexts';
import { textForKey } from 'app/utils/localization';
import { requestCompleteReminder } from 'middleware/api/crm';
import onRequestError from '../../../../../../utils/onRequestError';
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
    <div
      className={clsx(styles.reminderItem, {
        [styles.expired]: reminder.active,
        [styles.completed]: reminder.completed,
      })}
    >
      {reminder.completed ? (
        <DoneIcon />
      ) : (
        <Image
          src='/icons-alarm-80.png'
          alt='Reminder'
          width={40}
          height={40}
        />
      )}
      <div className={styles.dataWrapper}>
        <Typography className={styles.dateText}>{headerText}</Typography>
        <Typography className={clsx(styles.noteText, styles.typeText)}>
          {textForKey(`crm_reminder_type_${reminder.type}`)}:{' '}
          {reminder.comment ? `${reminder.comment}` : ''}
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
};
