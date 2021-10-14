import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { requestFetchReminders } from "../../../../../../middleware/api/crm";
import { textForKey } from "../../../../../utils/localization";
import onRequestError from "../../../../../utils/onRequestError";
import styles from './RemindersContainer.module.scss';
import { useSelector } from "react-redux";
import { updatedDealSelector, updatedReminderSelector } from "../../../../../../redux/selectors/crmSelector";
import Reminder from "./Reminder";
import { CircularProgress } from "@material-ui/core";

const RemindersContainer = ({ deal }) => {
  const updatedDeal = useSelector(updatedDealSelector);
  const updatedReminder = useSelector(updatedReminderSelector);
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (updatedReminder == null) {
      return;
    }
    fetchReminders();
  }, [updatedReminder, items]);

  useEffect(() => {
    if (updatedDeal == null || deal == null || updatedDeal.id !== deal.id) {
      return;
    }
    fetchReminders();
  }, [updatedDeal, deal]);

  useEffect(() => {
    if (deal == null) {
      return;
    }
    fetchReminders()
  }, [deal]);

  const fetchReminders = async () => {
    try {
      setIsFetching(true);
      const response = await requestFetchReminders(deal.id);
      const uncompletedItems = response.data.filter(item => !item.completed)
      setItems(orderBy(uncompletedItems, ['dueDate'], ['asc']));
    } catch (error) {
      onRequestError(error);
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <div className={styles.remindersContainer}>
      {isFetching ? (
        <div className="progress-bar-wrapper">
          <CircularProgress className="circular-progress-bar"/>
        </div>
      ) : null}
      <Typography className={styles.title}>
        {textForKey('crm_reminders')}
      </Typography>
      <Divider color="#E5E5E5"/>
      <div className={styles.data}>
        {items.map((reminder) => (
          <Reminder key={reminder.id} reminder={reminder}/>
        ))}
      </div>
    </div>
  )
};

export default RemindersContainer;

RemindersContainer.proptType = {
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
      photoUrl: PropTypes.string
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
}
