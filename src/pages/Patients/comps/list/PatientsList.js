import React from 'react';

import IconMoreHorizontal from '../../../../assets/icons/iconMoreHorizontal';
import IconPlus from '../../../../assets/icons/iconPlus';
import { textForKey } from '../../../../utils/localization';
import PatientItem from './PatientItem';

const PatientsList = props => {
  return (
    <div className='patients-root__list'>
      <div className='patients-root__list__header'>
        {textForKey('All patients')}
        <div className='more-btn'>
          <IconMoreHorizontal />
        </div>
      </div>
      <div className='patients-root__list__content'>
        <PatientItem selected={true} />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
        <PatientItem />
      </div>
      <div className='patients-root__list__add-btn'>
        <IconPlus />
        {textForKey('Add patient')}
      </div>
    </div>
  );
};

export default PatientsList;
