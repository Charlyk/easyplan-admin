import React, { useEffect, useMemo, useReducer } from "react";
import moment from "moment-timezone";
import upperFirst from 'lodash/upperFirst';

import { requestCreateDealReminder } from "../../../../middleware/api/crm";
import { Role } from "../../../utils/constants";
import { textForKey } from "../../../utils/localization";
import onRequestError from "../../../utils/onRequestError";
import EASModal from "../../common/modals/EASModal";
import EASSelect from "../../common/EASSelect";
import EASTextarea from "../../common/EASTextarea";
import EASTextField from "../../common/EASTextField";
import reducer, {
  initialState,
  reminderTypes,
  setType,
  setUser,
  setStartTime,
  setNote,
  setEndTime,
  setDate,
  setIsLoading,
  resetState,
} from './AddReminderModal.reducer';
import styles from './AddReminderModal.module.scss';

const AddReminderModal = ({ open, deal, currentClinic, onClose }) => {
  const [{
    startTime,
    endTime,
    date,
    user,
    type,
    note,
    isLoading,
  }, localDispatch] = useReducer(reducer, initialState);
  const stringDate = moment(date).format('YYYY-MM-DD');
  const isFormValid = !moment(date).isBefore(moment(), 'date') && startTime < endTime;

  const receptionUsers = useMemo(() => {
    if (currentClinic == null) {
      return [];
    }
    return currentClinic.users
      .filter((user) => (
        user.roleInClinic === Role.reception ||
        user.roleInClinic === Role.manager ||
        user.roleInClinic === Role.admin
      ))
      .map((user) => ({
        ...user,
        name: user.fullName,
        label: user.fullName,
      }));
  }, [currentClinic]);

  useEffect(() => {
    if (!open) {
      localDispatch(resetState());
    }
  }, [open]);

  useEffect(() => {
    localDispatch(setUser(receptionUsers[0]));
  }, [receptionUsers, currentClinic]);

  const handleUserChange = (event) => {
    const newValue = event.target.value;
    const newUser = receptionUsers.find(user => user.id === parseInt(newValue));
    localDispatch(setUser(newUser));
  }

  const handleTypeChange = (event) => {
    const newValue = event.target.value;
    const newType = reminderTypes.find(item => item.id === newValue);
    localDispatch(setType(newType));
  }

  const handleDateChange = (newDate) => {
    const date = moment(newDate).toDate();
    localDispatch(setDate(date));
  }

  const handleStartTimeChange = (newTime) => {
    localDispatch(setStartTime(newTime));
  };

  const handleEndTimeChange = (newTime) => {
    localDispatch(setEndTime(newTime));
  };

  const handleNoteChange = (newText) => {
    localDispatch(setNote(newText));
  }

  const handleSubmit = async (event) => {
    if (!isFormValid) {
      return;
    }
    try {
      localDispatch(setIsLoading(true));
      const requestBody = {
        date: moment(date).format('YYYY-MM-DD'),
        startTime,
        endTime,
        userId: user.id,
        type: type.id,
        comment: note,
      }
      await requestCreateDealReminder(deal.id, requestBody);
      onClose?.();
    } catch (error) {
      onRequestError(error);
    } finally {
      localDispatch(setIsLoading(false));
    }
  }

  return (
    <EASModal
      open={open}
      title={textForKey('crm_new_reminder')}
      className={styles.addReminderModal}
      paperClass={styles.modalPaper}
      isPositiveLoading={isLoading}
      isPositiveDisabled={!isFormValid}
      onPrimaryClick={handleSubmit}
      onClose={onClose}
    >
      <form className={styles.formRoot} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <EASTextField
            type="date"
            fieldLabel={textForKey('Date')}
            inputClass={styles.fieldText}
            fieldClass={styles.fieldRoot}
            error={moment(date).isBefore(moment(), 'date')}
            containerClass={styles.fieldContainer}
            value={stringDate}
            onChange={handleDateChange}
          />
          <EASTextField
            type="time"
            fieldLabel={textForKey('Start time')}
            inputClass={styles.fieldText}
            fieldClass={styles.fieldRoot}
            containerClass={styles.timeField}
            error={endTime < startTime}
            value={startTime}
            max={endTime}
            onChange={handleStartTimeChange}
          />
          <EASTextField
            type="time"
            fieldLabel={textForKey('End time')}
            inputClass={styles.fieldText}
            fieldClass={styles.fieldRoot}
            containerClass={styles.timeField}
            error={endTime < startTime}
            min={startTime}
            value={endTime}
            onChange={handleEndTimeChange}
          />
        </div>
        <div className={styles.header}>
          <EASSelect
            rootClass={styles.selectRoot}
            label={upperFirst(textForKey('crm_reminder_user'))}
            labelId="user-id-select"
            value={user?.id ?? '0'}
            options={receptionUsers}
            onChange={handleUserChange}
          />
          <EASSelect
            rootClass={styles.selectRoot}
            label={textForKey('crm_reminder_type')}
            labelId="reminder_type"
            value={type.id}
            options={reminderTypes}
            onChange={handleTypeChange}
          />
        </div>
        <EASTextarea
          rows={4}
          maxRows={4}
          value={note}
          onChange={handleNoteChange}
          placeholder={textForKey('Add a comment')}
        />
      </form>
    </EASModal>
  );
};

export default AddReminderModal;