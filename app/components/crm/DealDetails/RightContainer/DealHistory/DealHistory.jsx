import React, { useEffect, useReducer, useRef } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import first from 'lodash/first';
import last from 'lodash/last';
import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { textForKey } from 'app/utils/localization';
import { dealDetailsSelector } from 'redux/selectors/crmBoardSelector';
import styles from './DealHistory.module.scss';
import reducer, {
  initialState,
  ItemType,
  setHistory,
} from './DealHistory.reducer';
import LogItem from './LogItem';
import MessageItem from './MessageItem';
import NoteItem from './NoteItem';
import PhoneCallItem from './PhoneCallItem';
import ReminderItem from './ReminderItem';
import SMSMessageItem from './SMSMessageItem';

const DealHistory = ({ onPlayAudio }) => {
  const containerRef = useRef(null);
  const details = useSelector(dealDetailsSelector);
  const [{ items }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (details == null) {
      return;
    }
    localDispatch(setHistory(details));
  }, [details]);

  const renderItem = (historyItem, index, items) => {
    if (details == null) {
      return null;
    }
    switch (historyItem.itemType) {
      case ItemType.message: {
        const { contact } = details.deal;
        const messages = items.filter(
          (item) => item.itemType === ItemType.message,
        );
        const incomeItems = messages.filter(
          (item) => item.senderId === contact.identificator,
        );
        const outgoingItems = messages.filter(
          (item) => item.senderId !== contact.identificator,
        );
        const messageType =
          contact.identificator === historyItem.senderId
            ? 'income'
            : 'outgoing';
        const lastItem = last(
          messageType === 'income' ? incomeItems : outgoingItems,
        );
        const isLastOfType = lastItem.id === historyItem.id;
        const firstItem = first(messages);
        const isFirstOfType = firstItem.id === historyItem.id;

        const lastMessage = last(messages);
        const isLastMessage = lastMessage.id === historyItem.id;
        return (
          <MessageItem
            key={historyItem.id}
            isFirstOfType={isFirstOfType}
            isLastOfType={isLastOfType}
            isLastMessage={isLastMessage}
            isFirstMessage={isFirstOfType}
            message={historyItem}
            contact={details.deal.contact}
            messageType={messageType}
          />
        );
      }
      case ItemType.note: {
        return <NoteItem key={historyItem.id} note={historyItem} />;
      }
      case ItemType.reminder: {
        return <ReminderItem key={historyItem.id} reminder={historyItem} />;
      }
      case ItemType.log: {
        const logItems = items.filter((item) => item.itemType === ItemType.log);
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
        );
      }
      case ItemType.sms: {
        return <SMSMessageItem key={historyItem.id} message={historyItem} />;
      }
      case ItemType.phoneCall: {
        return (
          <PhoneCallItem
            key={historyItem.id}
            call={historyItem}
            onPlayAudio={onPlayAudio}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className={styles.dealHistory}>
      <Box padding={1}>
        {Object.keys(items)
          .sort()
          .map((value) => {
            const data = orderBy(
              items[value],
              (item) => item.messageDate ?? item.created,
              ['asc'],
            );
            const groupDate = moment(value);
            const isToday = groupDate.isSame(moment(), 'date');
            return (
              <Box key={value}>
                <div className={styles.groupItem}>
                  <div className={styles.divider} />
                  <Typography className={styles.groupTitle}>
                    {isToday
                      ? textForKey('Today')
                      : groupDate.format('DD MMMM YYYY')}
                  </Typography>
                  <div className={styles.divider} />
                </div>
                {data.map(renderItem)}
              </Box>
            );
          })}
      </Box>
    </div>
  );
};

export default DealHistory;

DealHistory.propTypes = {
  deal: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
      created: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      dateAndTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      canceledReason: PropTypes.string,
      doctor: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
  onPlayAudio: PropTypes.func,
};
