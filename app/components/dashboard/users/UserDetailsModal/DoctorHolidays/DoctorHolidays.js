import React from 'react';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import IconDelete from '../../../../icons/iconDelete';
import IconEdit from '../../../../icons/iconEdit';
import IconUmbrella from '../../../../icons/iconUmbrella';
import { textForKey } from '../../../../../../utils/localization';
import styles from './DoctorHolidays.module.scss';

const DoctorHoliday = ({ holiday, onEdit, onDelete }) => {
  return (
    <div className={styles['doctor-holidays__holiday']}>
      <IconUmbrella />
      <div className={styles['doctor-holidays__holiday__data']}>
        <div className={styles['doctor-holidays__holiday__title']}>
          {moment(holiday.startDate).format('DD MMM yyyy')} -{' '}
          {moment(holiday.endDate).format('DD MMM yyyy')}
        </div>
        <div className={styles['doctor-holidays__holiday__description']}>
          {holiday.description?.length > 0
            ? holiday.description
            : textForKey('No description')}
        </div>
      </div>
      <div
        role='button'
        tabIndex={0}
        className={styles['doctor-holidays__edit']}
        onClick={() => onEdit(holiday)}
      >
        <IconEdit />
      </div>
      <div
        role='button'
        tabIndex={0}
        className={styles['doctor-holidays__delete']}
        onClick={() => onDelete(holiday)}
      >
        <IconDelete />
      </div>
    </div>
  );
};

const DoctorHolidays = (props) => {
  const { show, data, onCreateOrUpdate, onDeleteHoliday } = props;
  const classes = clsx(styles['doctor-holidays'], show ? styles.expanded : styles.collapsed);
  return (
    <div className={classes}>
      <div className={styles['doctor-holidays__header']}>
        <div className={styles['doctor-holidays__header__title']}>
          {textForKey('Add a holiday')}
        </div>
        <Button
          variant='outline-primary'
          onClick={() => onCreateOrUpdate(null)}
        >
          {textForKey('Add holiday')}
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