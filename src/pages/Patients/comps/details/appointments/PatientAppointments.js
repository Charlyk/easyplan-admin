import React from 'react';

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import IconPlus from '../../../../../assets/icons/iconPlus';
import { textForKey } from '../../../../../utils/localization';
import Appointment from './Appointment';

const PatientAppointments = ({ patient }) => {
  return (
    <div className='patient-appointments'>
      <div className='patient-appointments__appointments-data'>
        <Appointment />
        <Appointment />
        <Appointment />
        <Appointment />
      </div>
      <div className='patient-appointments__actions'>
        <Button className='btn-outline-primary' variant='outline-primary'>
          {textForKey('Add appointment')}
          <IconPlus fill={null} />
        </Button>
      </div>
    </div>
  );
};

export default PatientAppointments;

PatientAppointments.propTypes = {
  patient: PropTypes.object,
};
