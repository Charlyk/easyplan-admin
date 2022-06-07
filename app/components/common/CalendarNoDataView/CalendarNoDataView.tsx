import React, { useMemo } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import { useTranslate } from 'react-polyglot';
import { useSelector } from 'react-redux';
import { viewDateSelector } from 'redux/selectors/scheduleSelector';
import styles from './CalendarNoDataView.module.scss';

interface CalendarNoDataViewProps {
  showButton?: boolean;
  onSetupHours?: () => void;
}

const CalendarNoDataView: React.FC<CalendarNoDataViewProps> = ({
  showButton,
  onSetupHours,
}) => {
  const textForKey = useTranslate();
  const selectedDate = useSelector(viewDateSelector);

  const date = useMemo(() => {
    return moment(selectedDate ?? '').format('DD MMM YYYY');
  }, [selectedDate]);

  return (
    <div className={styles.calendarNoDataView}>
      <Typography className={styles.dayOffLabel}>
        {textForKey('clinic_has_no_working_hours', date)}
      </Typography>
      {showButton && (
        <Button className={styles.addAppointmentBtn} onClick={onSetupHours}>
          {textForKey('edit_working_hours')}
        </Button>
      )}
    </div>
  );
};

export default CalendarNoDataView;
