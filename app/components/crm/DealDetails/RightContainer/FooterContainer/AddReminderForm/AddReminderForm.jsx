import React, { useEffect, useMemo, useRef, useState } from "react";
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
import styles from './AddReminderForm.module.scss';

const tomorrow = moment().add(1, 'day');
const reminderTypes = [
  {
    id: 'contact',
    name: textForKey('crm_reminder_type_contact'),
  },
  {
    id: 'meeting',
    name: textForKey('crm_reminder_type_meeting'),
  },
];

const AddReminderForm = ({ currentClinic, isLoading, onSubmit }) => {
  const [startTime, setStartTime] = useState(tomorrow.toDate());
  const [endTime, setEndTime] = useState(tomorrow.add(15, 'minutes').toDate());
  const [date, setDate] = useState(tomorrow.toDate());
  const [user, setUser] = useState(null);
  const [type, setType] = useState(reminderTypes[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
    setUser(receptionUsers[0]);
  }, [receptionUsers, currentClinic]);

  const stringDate = moment(date).format('DD.MM.YYYY');
  const stringStartTime = moment(startTime).format('HH:mm');
  const stringEndTime = moment(endTime).format('HH:mm');

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleCloseDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleUserChange = (event) => {
    const newValue = event.target.value;
    const newUser = receptionUsers.find(user => user.id === parseInt(newValue));
    setUser(newUser);
  }

  const handleTypeChange = (event) => {
    const newValue = event.target.value;
    const newType = reminderTypes.find(item => item.id === newValue);
    setType(newType);
  }

  const handleDateChange = (newDate) => {
    const date = moment(newDate).toDate();
    setDate(date);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({ date, startTime, endTime, user, type })
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
          containerClass={styles.fieldContainer}
          value={moment(date).format('YYYY-MM-DD')}
          onChange={handleDateChange}
        />
        <EASTextField
          type="time"
          inputClass={styles.fieldText}
          fieldClass={styles.fieldRoot}
          containerClass={styles.timeField}
          value={stringStartTime}
        />
        <Typography className={clsx(styles.text, styles.middle)}>
          -
        </Typography>
        <EASTextField
          type="time"
          inputClass={styles.fieldText}
          fieldClass={styles.fieldRoot}
          containerClass={styles.timeField}
          value={stringEndTime}
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
        placeholder={textForKey('Add a comment')}
      />
      <Box marginTop={.5}>
        <LoadingButton
          isLoading={isLoading}
          disabled={isLoading}
          className="positive-button"
          onPointerUp={handleSubmit}
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
