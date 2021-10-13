import React, { useEffect, useMemo, useReducer, useState } from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import moment from "moment-timezone";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Role } from "../../../../../../utils/constants";
import { textForKey } from "../../../../../../utils/localization";
import LoadingButton from "../../../../../common/LoadingButton";
import EASTextField from "../../../../../common/EASTextField";
import EASTextarea from "../../../../../common/EASTextarea";
import EASSelect from "../../../../../common/EASSelect";
import reducer, {
  initialState,
  reminderTypes,
  setType,
  setUser,
  setStartTime,
  setNote,
  setEndTime,
  setDate,
  resetState
} from './AddReminderForm.reducer';
import styles from './AddReminderForm.module.scss';

const AddReminderForm = ({ currentClinic, isLoading, onSubmit }) => {
  const [{
    startTime,
    endTime,
    date,
    user,
    type,
    note
  }, localDispatch] = useReducer(reducer, initialState);

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
    localDispatch(resetState());
  }, [isLoading])

  useEffect(() => {
    localDispatch(setUser(receptionUsers[0]));
  }, [receptionUsers, currentClinic]);

  const stringDate = moment(date).format('YYYY-MM-DD');
  const isFormValid = !moment(date).isBefore(moment(), 'date') && startTime < endTime;

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isFormValid) {
      return
    }
    onSubmit?.({ date, startTime, endTime, user, type, noteText: note })
  }

  return (
    <form className={styles.addReminderForm} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <Typography className={clsx(styles.text, styles.start)}>
          {textForKey('crm_reminder_date')}
        </Typography>
        <EASTextField
          type="date"
          inputClass={styles.fieldText}
          fieldClass={styles.fieldRoot}
          error={moment(date).isBefore(moment(), 'date')}
          containerClass={styles.fieldContainer}
          value={stringDate}
          onChange={handleDateChange}
        />
        <EASTextField
          type="time"
          inputClass={styles.fieldText}
          fieldClass={styles.fieldRoot}
          containerClass={styles.timeField}
          error={endTime < startTime}
          value={startTime}
          max={endTime}
          onChange={handleStartTimeChange}
        />
        <Typography className={clsx(styles.text, styles.middle)}>
          -
        </Typography>
        <EASTextField
          type="time"
          inputClass={styles.fieldText}
          fieldClass={styles.fieldRoot}
          containerClass={styles.timeField}
          error={endTime < startTime}
          min={startTime}
          value={endTime}
          onChange={handleEndTimeChange}
        />
        <Typography className={clsx(styles.text, styles.end)}>
          {textForKey('crm_reminder_user')}
        </Typography>
        <EASSelect
          variant="text"
          selectClass={styles.selectRoot}
          value={user?.id ?? '0'}
          options={receptionUsers}
          onChange={handleUserChange}
        />:
        <EASSelect
          variant="text"
          selectClass={styles.selectRoot}
          value={type.id}
          options={reminderTypes}
          onChange={handleTypeChange}
        />
      </div>
      <EASTextarea
        rows={2}
        maxRows={2}
        value={note}
        onChange={handleNoteChange}
        placeholder={textForKey('Add a comment')}
      />
      <Box marginTop={.5}>
        <LoadingButton
          isLoading={isLoading}
          disabled={isLoading}
          className="positive-button"
          onClick={handleSubmit}
        >
          {textForKey('crm_add_reminder')}
        </LoadingButton>
      </Box>
    </form>
  )
};

export default AddReminderForm;

AddReminderForm.propTypes = {
  currentClinic: PropTypes.any,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
}
