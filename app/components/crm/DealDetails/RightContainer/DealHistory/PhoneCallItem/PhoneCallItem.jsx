import React, { useMemo } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PhoneIcon from '@material-ui/icons/Call';
import OutgoingCallIcon from '@material-ui/icons/CallMade';
import FailedCallIcon from '@material-ui/icons/CallMissed';
import IncomeCallIcon from '@material-ui/icons/CallReceived';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import formatSeconds from 'app/utils/formatSeconds';
import { textForKey } from 'app/utils/localization';
import styles from './PhoneCallItem.module.scss';

const PhoneCallItem = ({ call, onPlayAudio }) => {
  const dateText = useMemo(() => {
    if (call == null) {
      return '-';
    }
    const callDate = moment(call.created).format('DD.MM.YYYY HH:mm');
    return textForKey('deal_phone_call_date')
      .replace('{1}', callDate)
      .replace('{2}', textForKey(`call_${call.direction}`))
      .replace(
        '{3}',
        textForKey(call.direction === 'Incoming' ? 'call_from' : 'call_to'),
      )
      .replace(
        '{4}',
        call.direction === 'Incoming' ? call.sourcePhone : call.targetPhone,
      );
  }, [call]);

  const directionAndTime = useMemo(() => {
    if (call == null) {
      return '-';
    }
    return textForKey('call_direction_with_time')
      .replace('{1}', textForKey(`call_${call.direction}`))
      .replace('{2}', formatSeconds(call.duration));
  }, [call]);

  const callIcon = useMemo(() => {
    switch (call.direction) {
      case 'Incoming':
        return <IncomeCallIcon className={styles.arrowIcon} />;
      case 'Outgoing':
        return <OutgoingCallIcon className={styles.arrowIcon} />;
      default:
        return <FailedCallIcon className={styles.arrowIcon} />;
    }
  }, [call]);

  const handlePlayAudio = () => {
    onPlayAudio?.(call);
  };

  const handleDownloadRecord = () => {
    if (call.fileUrl == null) {
      return;
    }
    const recordDate = moment(call.created);
    const year = recordDate.format('YYYY');
    const month = recordDate.format('MM');
    const date = recordDate.format('DD');
    const recordUrl = call.callId
      ? `https://sip6215.iphost.md/amocrm/router.php?route=record/get&call_id=${call.callId}`
      : `https://sip6215.iphost.md/monitor/${year}/${month}/${date}/${call.fileUrl.replace(
          ' ',
          '+',
        )}`;
    window.open(recordUrl, '_blank');
  };

  return (
    <div className={styles.phoneCall}>
      <div className={styles.iconWrapper}>
        <PhoneIcon />
        {callIcon}
      </div>
      <div className={styles.dataContainer}>
        <Typography className={styles.dateLabel}>{dateText}</Typography>
        <div className={styles.detailsWrapper}>
          <Typography className={styles.detailsLabel}>
            {directionAndTime}
          </Typography>
          <Button
            disabled={call?.fileUrl == null || call.status !== 'Answered'}
            variant='outlined'
            onClick={handlePlayAudio}
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
            disabled={call?.fileUrl == null || call.status !== 'Answered'}
            variant='text'
            onClick={handleDownloadRecord}
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
          {textForKey(`call_${call.status}`)}
        </Typography>
      </div>
    </div>
  );
};

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
    status: PropTypes.oneOf([
      'Answered',
      'Failed',
      'Busy',
      'NoAnswer',
      'Unknown',
    ]),
    duration: PropTypes.number,
    callId: PropTypes.string,
  }),
  onPlayAudio: PropTypes.func,
};
