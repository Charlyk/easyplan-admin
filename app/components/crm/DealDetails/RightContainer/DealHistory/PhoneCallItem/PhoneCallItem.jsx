import React, { useMemo } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PhoneIcon from '@material-ui/icons/Call';
import OutgoingCallIcon from '@material-ui/icons/CallMade';
import FailedCallIcon from '@material-ui/icons/CallMissed';
import IncomeCallIcon from '@material-ui/icons/CallReceived';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useDispatch } from 'react-redux';
import TextField from 'app/components/common/EASTextField';
import { dispatchUpdateCallRecords } from 'app/components/dashboard/patients/PatientDetailsModal/PatientPhoneRecords/PatientPhoneRecords.reducer';
import formatSeconds from 'app/utils/formatSeconds';
import getCallRecordUrl from 'app/utils/getCallRecordUrl';
import styles from './PhoneCallItem.module.scss';

const PhoneCallItem = ({ call, onPlayAudio }) => {
  const dispatch = useDispatch();
  const [isEdited, setIsEdited] = useState(false);
  const [inputValue, setInputValue] = useState(call.comment ?? '');
  const textForKey = useTranslate();
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
    return textForKey('call_direction_with_time', {
      first: textForKey(`call_${call.direction?.toLowerCase()}`),
      second: formatSeconds(call.duration),
    });
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

  const handleDownloadRecord = async () => {
    if (call.fileUrl == null) {
      return;
    }
    const recordUrl = getCallRecordUrl(call);
    try {
      const result = await fetch(recordUrl, { method: 'HEAD' });
      if (result.ok) {
        window.open(recordUrl, '_blank');
      } else if (recordUrl.endsWith('.wav')) {
        window.open(recordUrl.replace('.wav', '.ogg'), '_blank');
      }
    } catch (error) {
      window.open(recordUrl, '_blank');
    }
  };

  const onEditClick = () => {
    setIsEdited(true);
  };

  const onCancelClick = () => {
    setIsEdited(false);
  };

  const handleInputValueChange = (value) => {
    setInputValue(value);
  };

  const handleSaveComment = () => {
    dispatch(dispatchUpdateCallRecords({ id: call.id, comment: inputValue }));
    onCancelClick();
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
            disabled={
              call?.fileUrl == null ||
              call.status !== 'Answered' ||
              call.duration === 0
            }
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
            disabled={
              call?.fileUrl == null ||
              call.status !== 'Answered' ||
              call.duration === 0
            }
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
          {textForKey(`call_${call.status?.toLowerCase()}`)}
        </Typography>
        <div className={styles.commentWrapper}>
          {isEdited ? (
            <TextField
              className={styles.input}
              size={'small'}
              value={inputValue}
              onChange={handleInputValueChange}
            />
          ) : (
            <Typography className={styles.detailsLabel}>
              {call.comment ?? textForKey('no_comment_label')}
            </Typography>
          )}
          {isEdited ? (
            <>
              <Button
                variant={'outlined'}
                classes={{
                  root: styles.editBtn,
                  label: styles.editBtnLabel,
                  outlined: styles.outlinedBtn,
                  disabled: styles.disabledBtn,
                }}
                onClick={handleSaveComment}
              >
                {textForKey('save')}
              </Button>
              <Button
                classes={{
                  root: styles.editBtn,
                  label: styles.editBtnLabel,
                  outlined: styles.outlinedBtn,
                  disabled: styles.disabledBtn,
                }}
                variant={'outlined'}
                onClick={onCancelClick}
              >
                {textForKey('cancel')}
              </Button>
            </>
          ) : (
            <Button
              variant={'outlined'}
              classes={{
                root: styles.editBtn,
                label: styles.editBtnLabel,
                outlined: styles.outlinedBtn,
                disabled: styles.disabledBtn,
              }}
              onClick={onEditClick}
            >
              {textForKey(call.comment ? 'edit' : 'add_comment')}
            </Button>
          )}
        </div>
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
