import React from 'react';

import { Button } from 'react-bootstrap';

import IconPlus from '../../../../../assets/icons/iconPlus';
import { textForKey } from '../../../../../utils/localization';
import Appointment from '../appointments/Appointment';
import PatientNote from './PatientNote';

const PatientNotes = props => {
  return (
    <div className='patients-root__notes'>
      <div className='patients-root__notes__notes-data'>
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
        <PatientNote />
      </div>
      <div className='patients-root__notes__actions'>
        <Button className='btn-outline-primary' variant='outline-primary'>
          {textForKey('Add note')}
          <IconPlus />
        </Button>
      </div>
    </div>
  );
};

export default PatientNotes;
