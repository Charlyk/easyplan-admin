import React, { useEffect, useReducer } from "react";
import PropTypes from 'prop-types';
import last from 'lodash/last';
import first from 'lodash/first';
import onRequestError from "../../../../../utils/onRequestError";
import { requestFetchDealDetails } from "../../../../../../middleware/api/crm";
import reducer, {
  initialState, ItemType,
  setHistory,
  setIsFetching,
} from './DealHistory.reducer';
import styles from './DealHistory.module.scss';
import { CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import MessageItem from "./MessageItem";
import Typography from "@material-ui/core/Typography";
import moment from "moment-timezone";
import NoteItem from "./NoteItem";

const DealHistory = ({ deal }) => {
  const [{ items, reminders, isFetching }, localDispatch] = useReducer(reducer, initialState);

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
        const isLast = lastItem.id === historyItem.id;
        const firstItem = first(messages);
        const isFirst = firstItem.id === historyItem.id;
        return (
          <MessageItem
            isFirst={isFirst}
            isLast={isLast}
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
      default:
        return null
    }
  };

  return (
    <div className={styles.dealHistory}>
      {isFetching && (
        <div className="progress-bar-wrapper">
          <CircularProgress className="circular-progress-bar"/>
        </div>
      )}
      <Box padding={1}>
        {Object.keys(items).sort().map((value) => {
          const data = items[value];
          return (
            <Box key={value}>
              <div className={styles.groupItem}>
                <div className={styles.divider}/>
                <Typography className={styles.groupTitle}>
                  {moment(value).format('DD MMMM YYYY')}
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
