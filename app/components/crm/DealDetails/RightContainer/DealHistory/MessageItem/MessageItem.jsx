import React from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import IconAvatar from 'app/components/icons/iconAvatar';
import { textForKey } from 'app/utils/localization';
import styles from './MessageItem.module.scss';

const MessageItem = ({
  message,
  isFirstOfType,
  isLastOfType,
  isFirstMessage,
  isLastMessage,
  messageType,
}) => {
  const containerClass =
    messageType === 'income' ? styles.incomeMessage : styles.outgoingMessage;

  return (
    <div
      id={messageType}
      className={styles.messageItem}
      style={{
        // outside container styles
        marginTop: isFirstMessage ? '.5rem' : 0,
        marginBottom: isLastMessage ? '.5rem' : 0,
        borderTop: isFirstMessage ? '#c3c3c3 1px solid' : 'none',
        borderBottom: isLastMessage ? '#c3c3c3 1px solid' : 'none',
        borderTopRightRadius: isFirstMessage ? '4px' : 0,
        borderTopLeftRadius: isFirstMessage ? '4px' : 0,
        borderBottomRightRadius: isLastMessage ? '4px' : 0,
        borderBottomLeftRadius: isLastMessage ? '4px' : 0,
        // inside container styles
        paddingTop: isFirstOfType ? '1rem' : '.2rem',
        paddingBottom: isLastOfType ? '1rem' : 0,
      }}
    >
      <div className={containerClass}>
        {messageType === 'income' ? (
          <div
            className={clsx(styles.avatarContainer, {
              [styles.hidden]: !isLastOfType,
            })}
          >
            <IconAvatar />
          </div>
        ) : null}
        <div className={styles.textContainer}>
          <Typography className={styles.messageDate}>
            {moment(message.messageDate).format('DD MMM YYYY HH:mm')}
          </Typography>
          <Typography
            className={clsx(
              styles.messageText,
              !message.messageText && styles.noText,
            )}
          >
            {message.messageText || textForKey('No text')}
          </Typography>
        </div>
        {messageType === 'outgoing' ? (
          <div
            className={clsx(styles.avatarContainer, {
              [styles.hidden]: !isLastOfType,
            })}
          >
            <IconAvatar />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MessageItem;

MessageItem.propTypes = {
  isLastOfType: PropTypes.bool,
  isFirstOfType: PropTypes.bool,
  isLastMessage: PropTypes.bool,
  isFirstMessage: PropTypes.bool,
  messageType: PropTypes.oneOf(['income', 'outgoing']),
  message: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.string,
    itemType: PropTypes.string,
    lastUpdated: PropTypes.string,
    messageDate: PropTypes.string,
    messageId: PropTypes.string,
    messageText: PropTypes.string,
    senderId: PropTypes.string,
    senderImage: PropTypes.string,
    senderName: PropTypes.string,
    source: PropTypes.string,
  }),
};
