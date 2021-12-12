import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import IconPlus from 'app/components/icons/iconPlus';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import styles from './ColumnsWrapper.module.scss';

const CreateScheduleView = ({ startHour, endHour, onAddSchedule }) => {
  const handleAddScheduleClink = () => {
    onAddSchedule(startHour, endHour);
  };

  return (
    <Box className={styles.createScheduleView} onClick={handleAddScheduleClink}>
      {startHour != null && (
        <Typography className={styles.hourText}>
          {startHour} - {endHour}
        </Typography>
      )}
      <IconPlus fill='#fff' />
    </Box>
  );
};

export default React.memo(CreateScheduleView, areComponentPropsEqual);

CreateScheduleView.propTypes = {
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  onAddSchedule: PropTypes.func,
};
