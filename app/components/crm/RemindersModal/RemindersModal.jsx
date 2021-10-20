import React, { useEffect, useReducer } from "react";
import clsx from "clsx";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { requestFetchUserReminders } from "../../../../middleware/api/crm";
import { updatedReminderSelector } from "../../../../redux/selectors/crmSelector";
import BottomSheetDialog from "../../common/BottomSheetDialog";
import { textForKey } from "../../../utils/localization";
import onRequestError from "../../../utils/onRequestError";
import HeaderItem from "./HeaderItem";
import ReminderItem from "./ReminderItem";
import reducer, {
  filterOptions,
  initialState,
  setSelectedFilter,
  setReminders,
  setIsLoading,
  resetState,
} from "./RemindersModal.reducer";
import styles from "./RemindersModal.module.scss";

const RemindersModal = ({ open, onClose, onAddReminder }) => {
  const remoteReminder = useSelector(updatedReminderSelector);
  const [{
    selectedFilter,
    isLoading,
    reminders
  }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (remoteReminder != null) {
      fetchReminders();
    }
  }, [remoteReminder])

  useEffect(() => {
    if (open) {
      fetchReminders();
    } else {
      localDispatch(resetState());
    }
  }, [open])

  const fetchReminders = async () => {
    try {
      localDispatch(setIsLoading(true));
      const response = await requestFetchUserReminders();
      localDispatch(setReminders(response.data));
    } catch (error) {
      onRequestError(error);
    } finally {
      localDispatch(setIsLoading(false));
    }
  }

  const handleShortcutSelected = (filter) => {
    localDispatch(setSelectedFilter(filter));
  };

  const isShortcutSelected = (shortcut) => {
    return (selectedFilter?.id || 0) === shortcut;
  };

  return (
    <BottomSheetDialog
      open={open}
      saveText={textForKey('crm_add_reminder')}
      title={textForKey('crm_reminders')}
      onSave={onAddReminder}
      onClose={onClose}
    >
      <div className={styles.remindersModal}>
        <div className={styles.filterContainer}>
          <div className={styles.titleContainer}>
            <Typography className={styles.title}>{textForKey('Filter')}</Typography>
          </div>
          <div className={styles.filterOptionsContainer}>
            {filterOptions.map(item => (
              <div
                key={item.id}
                className={clsx(styles.filterOption, { [styles.selected]: isShortcutSelected(item.id) })}
                onClick={() => handleShortcutSelected(item)}
              >
                <Typography className={styles.label}>{item.name}</Typography>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.remindersContainer}>
          {Object.keys(reminders).map(value => {
            const items = reminders[value];
            return (
              <React.Fragment key={value}>
                <HeaderItem date={moment(value).toDate()}/>
                {items.map(reminder => (
                  <ReminderItem key={reminder.id} reminder={reminder} />
                ))}
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </BottomSheetDialog>
  )
};

export default RemindersModal;
