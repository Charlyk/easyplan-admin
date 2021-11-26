import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import EASHelpView from 'app/components/common/EASHelpView';
import IconPlus from 'app/components/icons/iconPlus';
import { textForKey } from 'app/utils/localization';
import notifications from 'app/utils/notifications/notifications';
import updateNotificationState from 'app/utils/notifications/updateNotificationState';
import { requestFetchReminders } from 'middleware/api/crm';
import { updatedReminderSelector } from 'redux/selectors/crmSelector';
import onRequestError from '../../../../../utils/onRequestError';
import Reminder from './Reminder';
import styles from './RemindersContainer.module.scss';

const RemindersContainer = ({ deal, showAddReminderHelp, onAddReminder }) => {
  const updatedReminder = useSelector(updatedReminderSelector);
  const [showAddHelp, setShowAddHelp] = useState(showAddReminderHelp);
  const [addReminderRef, setAddReminderRef] = useState(null);
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setShowAddHelp(showAddReminderHelp);
  }, [showAddReminderHelp]);

  useEffect(() => {
    if (updatedReminder == null || updatedReminder.deal.id !== deal.id) {
      return;
    }
    fetchReminders();
  }, [updatedReminder]);

  useEffect(() => {
    if (deal == null) {
      return;
    }
    fetchReminders();
  }, [deal]);

  const fetchReminders = async () => {
    try {
      setIsFetching(true);
      const response = await requestFetchReminders(deal.id);
      const uncompletedItems = response.data.filter((item) => !item.completed);
      setItems(orderBy(uncompletedItems, ['dueDate'], ['asc']));
    } catch (error) {
      onRequestError(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddReminder = () => {
    onAddReminder?.(deal);
  };

  const handleCloseAddHelp = () => {
    updateNotificationState(notifications.crmAddReminder.id, true);
    setShowAddHelp(false);
  };

  return (
    <div className={styles.remindersContainer}>
      {isFetching ? (
        <div className='progress-bar-wrapper'>
          <CircularProgress className='circular-progress-bar' />
        </div>
      ) : items.length === 0 ? (
        <div className={styles.noDataWrapper}>
          <Typography className={styles.noDataLabel}>
            {textForKey('crm_no_reminders')}
          </Typography>
        </div>
      ) : null}
      <div className={styles.titleContainer}>
        <Typography className={styles.title}>
          {textForKey('crm_reminders')}
        </Typography>
        <Tooltip title={textForKey('crm_add_reminder')}>
          <IconButton
            ref={setAddReminderRef}
            className={styles.addButton}
            onPointerUp={handleAddReminder}
          >
            <IconPlus fill='#3A83DC' />
          </IconButton>
        </Tooltip>
      </div>
      <Divider color='#E5E5E5' />
      <div className={styles.data}>
        {items.map((reminder) => (
          <Reminder key={reminder.id} reminder={reminder} />
        ))}
      </div>
      <EASHelpView
        open={showAddHelp}
        anchorEl={addReminderRef}
        notification={notifications.crmAddReminder}
        placement='left'
        onClose={handleCloseAddHelp}
      />
    </div>
  );
};

export default RemindersContainer;

RemindersContainer.proptType = {
  showAddReminderHelp: PropTypes.bool,
  deal: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.string,
    lastUpdated: PropTypes.string,
    messageSnippet: PropTypes.string,
    source: PropTypes.string,
    sourceDescription: PropTypes.string,
    contact: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      photoUrl: PropTypes.string,
    }),
    patient: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      phoneWithCode: PropTypes.string,
    }),
    state: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      color: PropTypes.string,
      orderId: PropTypes.number,
      deleteable: PropTypes.bool,
      type: PropTypes.string,
    }),
    assignedTo: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    service: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      currency: PropTypes.string,
    }),
    schedule: PropTypes.shape({
      id: PropTypes.number,
      created: PropTypes.string,
      dateAndTime: PropTypes.string,
      endTime: PropTypes.string,
      canceledReason: PropTypes.string,
      doctor: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
  onAddReminder: PropTypes.func,
};
