import React from 'react';

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import IconPlus from '../../../../../assets/icons/iconPlus';
import { textForKey } from '../../../../../utils/localization';
import Appointment from './Appointment';

const PatientAppointments = ({ patient }) => {
  return (
    <div className='patients-root__appointments'>
      <div className='patients-root__appointments__appointments-data'>
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
      </div>
      <div className='patients-root__appointments__actions'>
        <Button className='btn-outline-primary' variant='outline-primary'>
          {textForKey('Add appointment')}
          <IconPlus />
        </Button>
      </div>
    </div>
  );
};

export default PatientAppointments;

PatientAppointments.propTypes = {
  patient: PropTypes.object,
};
