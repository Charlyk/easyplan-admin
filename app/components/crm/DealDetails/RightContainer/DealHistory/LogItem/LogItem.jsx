import React from "react";
import PropTypes from 'prop-types';
import moment from "moment-timezone";
import Typography from "@material-ui/core/Typography";
import { textForKey } from "../../../../../../utils/localization";
import styles from './LogItem.module.scss';

const LogItem = ({ log, isFirst, isLast }) => {
  const userName = log.user ? `${log.user.firstName} ${log.user.lastName}` : textForKey('System');
  return (
    <div
      className={styles.logItem}
      style={{
        paddingTop: isFirst ? '.5rem' : 2,
        paddingBottom: isLast ? '.5rem' : 2,
      }}
    >
      <Typography className={styles.noteText}>
        {moment(log.created).format('DD.MM.YYYY HH:mm')}{' '}
        {userName}{' - '}
        {textForKey(`crm_log_action_${log.action}`)}:{' '}
        <span className={styles.payload}>{log.payload}</span>
      </Typography>
    </div>
  )
};

export default LogItem;

LogItem.propTypes = {
  isLast: PropTypes.bool,
  isFirst: PropTypes.bool,
  log: PropTypes.shape({
    action: PropTypes.string,
    created: PropTypes.string,
    id: PropTypes.number,
    itemType: PropTypes.string,
    lastUpdated: PropTypes.string,
    payload: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }),
};
