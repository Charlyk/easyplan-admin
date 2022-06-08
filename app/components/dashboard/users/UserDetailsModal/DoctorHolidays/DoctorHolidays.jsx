import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import IconDelete from 'app/components/icons/iconDelete';
import IconEdit from 'app/components/icons/iconEdit';
import IconUmbrella from 'app/components/icons/iconUmbrella';
import styles from './DoctorHolidays.module.scss';

const DoctorHoliday = ({ holiday, onEdit, onDelete }) => {
  const textForKey = useTranslate();
  return (
    <div className={styles.holiday}>
      <IconUmbrella />
      <div className={styles.data}>
        <div className={styles.title}>
          {moment(holiday.startDate).format('DD MMM yyyy')} -{' '}
          {moment(holiday.endDate).format('DD MMM yyyy')}
        </div>
        <div className={styles.description}>
          {holiday.description?.length > 0
            ? holiday.description
            : textForKey('no description')}
        </div>
      </div>
      <Box className={styles.edit} onClick={() => onEdit(holiday)}>
        <IconEdit />
      </Box>
      <Box className={styles.delete} onClick={() => onDelete(holiday)}>
        <IconDelete />
      </Box>
    </div>
  );
};

const DoctorHolidays = (props) => {
  const textForKey = useTranslate();
  const { show, data, onCreateOrUpdate, onDeleteHoliday } = props;
  const classes = clsx(
    styles.doctorHolidays,
    show ? styles.expanded : styles.collapsed,
  );
  return (
    <div className={classes}>
      <div className={styles.header}>
        <Button
          variant='outlined'
          classes={{
            root: styles.addButton,
            label: styles.addButtonLabel,
          }}
          onClick={() => onCreateOrUpdate(null)}
        >
          {textForKey('add holiday')}
        </Button>
      </div>
      {data.holidays.map((holiday, index) => (
        <DoctorHoliday
          holiday={holiday}
          key={`${index}-${holiday.id}-holiday`}
          onEdit={onCreateOrUpdate}
          onDelete={onDeleteHoliday}
        />
      ))}
    </div>
  );
};

export default DoctorHolidays;

DoctorHolidays.propTypes = {
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    holidays: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
  }),
  show: PropTypes.bool.isRequired,
  onCreateOrUpdate: PropTypes.func,
  onDeleteHoliday: PropTypes.func,
};

DoctorHoliday.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  holiday: PropTypes.shape({
    id: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    description: PropTypes.string,
  }),
};
