import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import IconEdit from '../../assets/icons/iconEdit';
import IconUmbrella from '../../assets/icons/iconUmbrella';
import { textForKey } from '../../utils/localization';

const DoctorHoliday = props => {
  return (
    <div className='doctor-holidays__holiday'>
      <IconUmbrella />
      <div className='doctor-holidays__holiday__data'>
        <div className='doctor-holidays__holiday__title'>
          October 20, 2020 until December 20, 2020
        </div>
        <div className='doctor-holidays__holiday__description'>
          {textForKey('No description')}
        </div>
      </div>
      <div className='doctor-holidays__edit'>
        <IconEdit />
      </div>
    </div>
  );
};

const DoctorHolidays = props => {
  const { show } = props;
  const classes = clsx('doctor-holidays', show ? 'expanded' : 'collapsed');
  return (
    <div className={classes}>
      <div className='doctor-holidays__header'>
        <div className='doctor-holidays__header__title'>Add a holiday</div>
        <Button variant='outline-primary'>{textForKey('Add holiday')}</Button>
      </div>
      <DoctorHoliday />
      <DoctorHoliday />
    </div>
  );
};

export default DoctorHolidays;

DoctorHolidays.propTypes = {
  show: PropTypes.bool.isRequired,
};
