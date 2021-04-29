import React from "react";
import PropTypes from 'prop-types';
import { Typography } from "@material-ui/core";
import IconPlus from "../../../../../components/icons/iconPlus";
import styles from './ColumnsWrapper.module.scss';

const CreateScheduleView = ({ startHour, endHour, onAddSchedule }) => {
  const handleAddScheduleClink = () => {
    onAddSchedule(startHour, endHour);
  };

  return (
    <span
      className={styles.createScheduleView}
      role='button'
      tabIndex={0}
      onClick={handleAddScheduleClink}
    >
      {startHour != null && (
        <Typography className={styles.hourText}>
          {startHour} - {endHour}
        </Typography>
      )}
      <IconPlus fill='#fff' />
    </span>
  )
}

export default CreateScheduleView;

CreateScheduleView.propTypes = {
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  onAddSchedule: PropTypes.func
}