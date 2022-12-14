import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import ReminderIcon from '@material-ui/icons/AccessTime';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import EASTextarea from 'app/components/common/EASTextarea';
import LoadingButton from 'app/components/common/LoadingButton';
import getReminderTexts from 'app/utils/getReminderTexts';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import { requestCompleteReminder } from 'middleware/api/crm';
import { setPatientDetails } from 'redux/slices/mainReduxSlice';
import styles from './ReminderItem.module.scss';

const ReminderItem = ({ reminder }) => {
  const dispatch = useDispatch();
  const [resultComment, setResultComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isToday, timeText, assigneeName, createdByName, contactName } =
    getReminderTexts(reminder);

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

  const handlePatientClick = (event) => {
    event.preventDefault();
    dispatch(
      setPatientDetails({
        show: true,
        patientId: reminder.deal.patient.id,
        canDelete: false,
      }),
    );
  };

  return (
    <div className={styles.reminderItem}>
      <div
        className={clsx(styles.dataContainer, {
          [styles.active]: isToday,
          [styles.completed]: reminder.completed,
          [styles.expired]: reminder.active,
        })}
      >
        <Typography className={styles.reminderDate}>
          <ReminderIcon />
          {timeText}
        </Typography>
        <Typography className={styles.detailsRow}>
          {upperFirst(textForKey('created by'))}:
          <span style={{ fontWeight: 'bold', marginLeft: 5 }}>
            {createdByName}
          </span>
        </Typography>
        <Typography className={styles.detailsRow}>
          {textForKey('crm_reminder_for')}:
          <span style={{ fontWeight: 'bold', marginLeft: 5 }}>
            {assigneeName}
          </span>
        </Typography>
        <Typography className={styles.detailsRow}>
          {textForKey('crm_reminder_type')}:
          <span
            style={{ fontWeight: 'bold', marginLeft: 5 }}
            className={styles.typeRow}
          >
            {textForKey(`crm_reminder_type_${reminder.type}`)}
            {reminder.comment ? ` - ${reminder.comment}` : ''}
          </span>
        </Typography>
        <Typography className={styles.detailsRow}>
          {textForKey('patient')}:
          <span style={{ fontWeight: 'bold', marginLeft: 5 }}>
            {reminder.deal.patient ? (
              <a href='#' onClick={handlePatientClick}>
                {contactName}
              </a>
            ) : (
              contactName
            )}
          </span>
        </Typography>
        {reminder.resultComment ? (
          <Typography className={styles.detailsRow}>
            {textForKey('crm_reminder_result')}:
            <span style={{ fontWeight: 'bold', marginLeft: 5 }}>
              {reminder.resultComment}
            </span>
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
    dueDate: PropTypes.string,
    endDate: PropTypes.string,
    id: PropTypes.number,
    lastUpdated: PropTypes.string,
    type: PropTypes.string,
    deal: PropTypes.shape({
      id: PropTypes.number,
      patient: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        phoneWithCode: PropTypes.string,
      }),
      contact: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        phoneNumber: PropTypes.string,
      }),
    }),
  }),
};
