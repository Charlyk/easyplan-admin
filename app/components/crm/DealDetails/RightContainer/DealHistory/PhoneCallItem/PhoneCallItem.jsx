import React, { useMemo } from "react";
import PropTypes from 'prop-types';
import moment from "moment-timezone";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PhoneIcon from '@material-ui/icons/Call';
import OutgoingCallIcon from '@material-ui/icons/CallMade';
import FailedCallIcon from '@material-ui/icons/CallMissed';
import IncomeCallIcon from '@material-ui/icons/CallReceived';
import { textForKey } from "../../../../../../utils/localization";
import styles from './PhoneCallItem.module.scss';

const PhoneCallItem = ({ call }) => {
  const dateText = useMemo(() => {
    if (call == null) {
      return '-'
    }
    const callDate = moment(call.created).format('DD.MM.YYYY HH:mm')
    return textForKey('deal_phone_call_date')
      .replace('{1}', callDate)
      .replace('{2}', textForKey(`call_${call.direction}`))
      .replace('{3}', textForKey(call.direction === 'Incoming' ? 'call_from' : 'call_to'))
      .replace('{4}', call.direction === 'Incoming' ? call.sourcePhone : call.targetPhone)
  }, [call]);

  const directionAndTime = useMemo(() => {
    if (call == null) {
      return '-'
    }
    return textForKey('call_direction_with_time')
      .replace('{1}', textForKey(`call_${call.direction}`))
      .replace('{2}', `${call.duration}`)
  }, [call]);

  const callIcon = useMemo(() => {
    switch (call.direction) {
      case "Incoming":
        return <IncomeCallIcon className={styles.arrowIcon}/>
      case "Outgoing":
        return <OutgoingCallIcon className={styles.arrowIcon}/>
      default:
        return <FailedCallIcon className={styles.arrowIcon}/>
    }
  }, [call]);

  return (
    <div className={styles.phoneCall}>
      <div className={styles.iconWrapper}>
        <PhoneIcon/>
        {callIcon}
      </div>
      <div className={styles.dataContainer}>
        <Typography className={styles.dateLabel}>
          {dateText}
        </Typography>
        <div className={styles.detailsWrapper}>
          <Typography className={styles.detailsLabel}>
            {directionAndTime}
          </Typography>
          <Button
            disabled={call?.fileUrl == null}
            variant="outlined"
            classes={{
              root: styles.listenBtn,
              label: styles.buttonLabel,
              outlined: styles.outlinedBtn,
              disabled: styles.disabledBtn,
            }}
          >
            {textForKey('call_listen')}
          </Button>
          <Button
            disabled={call?.fileUrl == null}
            variant="text"
            classes={{
              root: styles.downloadBtn,
              disabled: styles.disabledBtn,
              label: styles.buttonLabel,
            }}
          >
            {textForKey('call_download')}
          </Button>
        </div>
        <Typography className={styles.detailsLabel}>
          {textForKey('call_answered')}
        </Typography>
      </div>
    </div>
  )
}

export default PhoneCallItem;

PhoneCallItem.propTypes = {
  call: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.string,
    lastUpdated: PropTypes.string,
    direction: PropTypes.oneOf(['Incoming', 'Outgoing', 'Unknown']),
    sourcePhone: PropTypes.string,
    targetPhone: PropTypes.string,
    fileUrl: PropTypes.string,
    status: PropTypes.string,
    duration: PropTypes.number,
  }),
}
