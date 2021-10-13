import React from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import styles from './MessageItem.module.scss';
import IconAvatar from "../../../../../icons/iconAvatar";
import { textForKey } from "../../../../../../utils/localization";

const MessageItem = (
  {
    message,
    isFirst,
    isLast,
    messageType
  }
) => {
  const containerClass = messageType === 'income' ? styles.incomeMessage : styles.outgoingMessage;

  return (
    <div id={messageType} className={styles.messageItem} style={{ paddingTop: isFirst ? '1rem' : '.2rem'}}>
      <div className={containerClass}>
        {messageType === 'income' ? (
          <div className={clsx(
            styles.avatarContainer,
            {
              [styles.hidden]: !isLast
            }
          )}>
            <IconAvatar/>
          </div>
        ) : null}
        <div className={styles.textContainer}>
          <Typography className={clsx(styles.messageText, !message.messageText && styles.noText)}>
            {message.messageText || textForKey('No text')}
          </Typography>
        </div>
        {messageType === 'outgoing' ? (
          <div className={clsx(
            styles.avatarContainer,
            {
              [styles.hidden]: !isLast
            }
          )}>
            <IconAvatar/>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MessageItem;

MessageItem.propTypes = {
  isLast: PropTypes.bool,
  isFirst: PropTypes.bool,
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
}
