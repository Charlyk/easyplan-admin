import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import BottomSheetDialog from 'app/components/common/BottomSheetDialog';
import EASTextField from 'app/components/common/EASTextField';
import EasyDateRangePicker from 'app/components/common/EasyDateRangePicker';
import IconClose from 'app/components/icons/iconClose';
import extractCookieByName from 'app/utils/extractCookieByName';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import setDocCookies from 'app/utils/setDocCookies';
import { requestFetchUserReminders } from 'middleware/api/crm';
import { updatedReminderSelector } from 'redux/selectors/crmSelector';
import { DealView } from 'types';
import HeaderItem from './HeaderItem';
import ReminderItem from './ReminderItem';
import styles from './RemindersModal.module.scss';
import reducer, {
  filterOptions,
  initialState,
  setReminders,
  setIsLoading,
  setShowDateRangePicker,
  setFilters,
} from './RemindersModal.reducer';

const COOKIES_KEY = 'reminders_filter';
const defaultRange = {
  startDate: moment().toDate(),
  endDate: moment().add(7, 'days').toDate(),
};

interface RemindersModalProps {
  open: boolean;
  onClose: () => void;
  onAddReminder?: (deal: DealView) => void;
}

const RemindersModal: React.FC<RemindersModalProps> = ({ open, onClose }) => {
  const pickerRef = useRef(null);
  const remoteReminder = useSelector(updatedReminderSelector);
  const [{ filters, reminders, showDateRange }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  const dateRange = useMemo(() => {
    if (filters?.dateRange == null) {
      return null;
    }
    const [startDate, endDate] = filters.dateRange;
    return {
      startDate: moment(startDate, 'YYYY-MM-DD').toDate(),
      endDate: moment(endDate, 'YYYY-MM-DD').toDate(),
    };
  }, [filters.dateRange]);

  const stringRange = useMemo(() => {
    if (dateRange == null) {
      return '';
    }
    return `${moment(dateRange.startDate).format('DD.MM.YYYY')} - ${moment(
      dateRange.endDate,
    ).format('DD.MM.YYYY')}`;
  }, [dateRange]);

  useEffect(() => {
    const queryParams = extractCookieByName(COOKIES_KEY);
    if (!queryParams) {
      return;
    }
    const params = JSON.parse(atob(queryParams));
    localDispatch(setFilters(params));
  }, []);

  useEffect(() => {
    if (remoteReminder != null) {
      fetchReminders();
    }
  }, [remoteReminder]);

  useEffect(() => {
    if (open) {
      fetchReminders();
    }
  }, [open]);

  const fetchReminders = async () => {
    try {
      localDispatch(setIsLoading(true));
      const queryParams = extractCookieByName(COOKIES_KEY);
      const response = await requestFetchUserReminders(queryParams);
      localDispatch(setReminders(response.data));
    } catch (error) {
      onRequestError(error);
    } finally {
      localDispatch(setIsLoading(false));
    }
  };

  const handleClearDateRange = (event) => {
    event.stopPropagation();
    updateParams({
      ...filters,
      dateRange: initialState.filters.dateRange,
    });
  };

  const updateParams = (newParams) => {
    const stringQuery = JSON.stringify(newParams);
    const encoded = btoa(unescape(encodeURIComponent(stringQuery)));
    setDocCookies(COOKIES_KEY, encoded);
    localDispatch(setFilters(newParams));
    fetchReminders();
  };

  const handleShowRangePicker = () => {
    localDispatch(setShowDateRangePicker(true));
  };

  const handleCloseRangePicker = () => {
    localDispatch(setShowDateRangePicker(false));
  };

  const handleShortcutSelected = (shortcut) => {
    updateParams({ ...filters, shortcut });
  };

  const isShortcutSelected = (shortcut) => {
    return (filters?.shortcut?.id || 0) === shortcut;
  };

  const handleDateRangeChange = (data) => {
    const { startDate, endDate } = data.range1;
    updateParams({
      ...filters,
      dateRange: [
        moment(startDate).format('YYYY-MM-DD'),
        moment(endDate).format('YYYY-MM-DD'),
      ],
    });
  };

  return (
    <BottomSheetDialog
      open={open}
      canSave={false}
      title={textForKey('crm_reminders')}
      onClose={onClose}
    >
      <div className={styles.remindersModal}>
        <div className={styles.filterContainer}>
          <div className={styles.titleContainer}>
            <Typography className={styles.title}>
              {textForKey('Filter')}
            </Typography>
          </div>
          <div className={styles.filterOptionsContainer}>
            {filterOptions.map((item) => (
              <Box
                key={item.id}
                className={clsx(styles.filterOption, {
                  [styles.selected]: isShortcutSelected(item.id),
                })}
                onClick={() => handleShortcutSelected(item)}
              >
                <Typography className={styles.label}>{item.name}</Typography>
              </Box>
            ))}
            <div className={styles.dateRangeFieldContainer}>
              <EASTextField
                readOnly
                fieldLabel={textForKey('Period')}
                placeholder='DD.MM.YYYY - DD.MM.YYYY'
                value={stringRange}
                ref={pickerRef}
                onClick={handleShowRangePicker}
                endAdornment={
                  dateRange ? (
                    <IconButton
                      className={styles.clearBtn}
                      onClick={handleClearDateRange}
                    >
                      <IconClose />
                    </IconButton>
                  ) : null
                }
              />
            </div>
          </div>
        </div>
        <div className={styles.remindersContainer}>
          {Object.keys(reminders).map((value) => {
            const items = reminders[value];
            return (
              <React.Fragment key={value}>
                <HeaderItem date={moment(value).toDate()} />
                {items.map((reminder) => (
                  <ReminderItem key={reminder.id} reminder={reminder} />
                ))}
              </React.Fragment>
            );
          })}
        </div>

        <EasyDateRangePicker
          open={showDateRange}
          placement='right'
          pickerAnchor={pickerRef.current}
          dateRange={dateRange || defaultRange}
          onClose={handleCloseRangePicker}
          onChange={handleDateRangeChange}
        />
      </div>
    </BottomSheetDialog>
  );
};

export default RemindersModal;
