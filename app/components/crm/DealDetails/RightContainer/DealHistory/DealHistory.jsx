import React, { useEffect, useReducer, useRef } from "react";
import moment from "moment-timezone";
import PropTypes from 'prop-types';
import last from 'lodash/last';
import first from 'lodash/first';
import orderBy from 'lodash/orderBy';
import { useSelector } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import onRequestError from "../../../../../utils/onRequestError";
import { requestFetchDealDetails } from "../../../../../../middleware/api/crm";
import { updatedDealSelector, updatedReminderSelector } from "../../../../../../redux/selectors/crmSelector";
import MessageItem from "./MessageItem";
import NoteItem from "./NoteItem";
import reducer, {
  initialState,
  ItemType,
  setHistory,
  setIsFetching,
  setUpdatedReminder,
} from './DealHistory.reducer';
import styles from './DealHistory.module.scss';
import ReminderItem from "./ReminderItem";
import { textForKey } from "../../../../../utils/localization";
import LogItem from "./LogItem";
import SMSMessageItem from "./SMSMessageItem";

const DealHistory = ({ deal }) => {
  const containerRef = useRef(null);
  const updatedDeal = useSelector(updatedDealSelector);
  const updatedReminder = useSelector(updatedReminderSelector);
  const [{ items, isFetching }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (updatedReminder != null) {
      localDispatch(setUpdatedReminder({ reminder: updatedReminder, dealId: deal.id }));
      if (containerRef.current != null) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }
  }, [updatedReminder, deal]);

  useEffect(() => {
    if (deal == null || updatedDeal?.id !== deal?.id) {
      return;
    }
    fetchDealDetails();
  }, [updatedDeal, deal]);

  useEffect(() => {
    if (deal == null) {
      return;
    }
    fetchDealDetails();
  }, [deal]);

  const fetchDealDetails = async () => {
    try {
      localDispatch(setIsFetching(true));
      const response = await requestFetchDealDetails(deal.id);
      localDispatch(setHistory(response.data));
    } catch (error) {
      onRequestError(error);
    } finally {
      localDispatch(setIsFetching(false));
      if (containerRef.current != null) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }
  };

  const renderItem = (historyItem, index, items) => {
    if (deal == null) {
      return null;
    }
    switch (historyItem.itemType) {
      case ItemType.message: {
        const { contact } = deal;
        const messages = items.filter((item) => (item.itemType === ItemType.message));
        const incomeItems = messages.filter((item) => (item.senderId === contact.identificator));
        const outgoingItems = messages.filter((item) => (item.senderId !== contact.identificator));
        const messageType = contact.identificator === historyItem.senderId ? 'income' : 'outgoing';
        const lastItem = last(messageType === 'income' ? incomeItems : outgoingItems);
        const isLastOfType = lastItem.id === historyItem.id;
        const firstItem = first(messages);
        const isFirstOfType = firstItem.id === historyItem.id;

        const lastMessage = last(messages);
        const isLastMessage = lastMessage.id === historyItem.id;
        return (
          <MessageItem
            isFirstOfType={isFirstOfType}
            isLastOfType={isLastOfType}
            isLastMessage={isLastMessage}
            isFirstMessage={isFirstOfType}
            message={historyItem}
            contact={deal.contact}
            messageType={messageType}
          />
        );
      }
      case ItemType.note: {
        return (
          <NoteItem key={historyItem.id} note={historyItem}/>
        )
      }
      case ItemType.reminder: {
        return (
          <ReminderItem key={historyItem.id} reminder={historyItem} />
        )
      }
      case ItemType.log: {
        const logItems = items.filter((item) => (item.itemType === ItemType.log));
        const lastItem = last(logItems);
        const isLast = lastItem.id === historyItem.id;
        const firstItem = first(logItems);
        const isFirst = firstItem.id === historyItem.id;
        return (
          <LogItem
            key={historyItem.id}
            isLast={isLast}
            isFirst={isFirst}
            log={historyItem}
          />
        )
      }
      case ItemType.sms: {
        return (
          <SMSMessageItem
            key={historyItem.id}
            message={historyItem}
          />
        )
      }
      default:
        return null
    }
  };

  return (
    <div ref={containerRef} className={styles.dealHistory}>
      {isFetching && (
        <div className="progress-bar-wrapper">
          <CircularProgress className="circular-progress-bar"/>
        </div>
      )}
      <Box padding={1}>
        {Object.keys(items).sort().map((value) => {
          const data = orderBy(items[value], (item) => item.messageDate ?? item.created, ['asc']);
          const groupDate = moment(value);
          const isToday = groupDate.isSame(moment(), 'date')
          return (
            <Box key={value}>
              <div className={styles.groupItem}>
                <div className={styles.divider}/>
                <Typography className={styles.groupTitle}>
                  {isToday ? textForKey('Today') : groupDate.format('DD MMMM YYYY')}
                </Typography>
                <div className={styles.divider}/>
              </div>
              {data.map(renderItem)}
            </Box>
          )
        })}
      </Box>
    </div>
  )
};

export default DealHistory;

DealHistory.propTypes = {
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
      identificator: PropTypes.string,
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