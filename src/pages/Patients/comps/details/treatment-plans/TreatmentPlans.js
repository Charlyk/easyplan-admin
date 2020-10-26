import React, { useEffect, useState } from 'react';

import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

import EasyTab from '../../../../../components/EasyTab';
import dataAPI from '../../../../../utils/api/dataAPI';
import { textForKey } from '../../../../../utils/localization';

const PlanType = {
  mandible: 'mandible',
  maxillary: 'maxillary',
};

const TreatmentPlans = ({ patient }) => {
  const [plan, setPlan] = useState(null);
  const [planType, setPlanType] = useState(PlanType.mandible);

  useEffect(() => {
    if (patient?.treatmentPlan == null) {
      fetchTreatmentPlan();
    } else {
      console.log(patient);
      setPlan(patient.treatmentPlan);
    }
  }, [patient]);

  const fetchTreatmentPlan = async () => {
    const response = await dataAPI.fetchTreatmentPlan(patient.id);
    if (response.isError) {
      console.error(response.message);
    } else {
      setPlan(response.data);
    }
  };

  const handleTypeChange = newType => {
    setPlanType(newType);
  };

  const classRow = plan && (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Class')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          {plan[planType].classes.map(item => (
            <div className={clsx('option-button', 'selected')} key={item}>
              <span className='option-text'>{item}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const occlusionRow = plan && (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Occlusion')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          {plan[planType].occlusions.map(item => (
            <div className={clsx('option-button', 'selected')} key={item}>
              <span className='option-text'>{textForKey(item)}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const fallenBracketsRow = plan && (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Fallen brackets')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          {plan[planType].fallenBraces.map(item => (
            <div className={clsx('option-button', 'selected')} key={item}>
              <span className='option-text'>{item}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const radiographRow = plan && (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Radiografie')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          {plan[planType].radiographs.map(item => (
            <div className={clsx('option-button', 'selected')} key={item}>
              <span className='option-text'>{textForKey(item)}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const bracesRow = plan && (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Braces')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          {plan[planType].braces.map(item => (
            <div className={clsx('option-button', 'selected')} key={item.id}>
              <span className='option-text'>{textForKey(item.name)}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const treatmentTypeRow = plan && (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Treatment type')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          {plan[planType].treatmentTypes.map(item => (
            <div className={clsx('option-button', 'selected')} key={item.id}>
              <span className='option-text'>{item.name}</span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );

  const molarCaninRow = plan && (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        <span className='group-subtitle'>{textForKey('Angle Class')}</span>
      </td>
      <td valign='top'>
        <div className='options-container'>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            disabled
            value={plan[planType].malocclusion.molarCanin.molar}
            custom
          >
            <option value='select'>
              {textForKey('Molar')}{' '}
              {plan[planType].malocclusion.molarCanin.molar}
            </option>
          </Form.Control>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            disabled
            value={plan[planType].malocclusion.molarCanin.canin}
            custom
          >
            <option value='select'>
              {textForKey('Canin')}{' '}
              {plan[planType].malocclusion.molarCanin.canin}
            </option>
          </Form.Control>
          <div className='separator' />
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            disabled
            value={plan[planType].malocclusion.caninMolar.canin}
            custom
          >
            <option value='select'>
              {textForKey('Canin')}{' '}
              {plan[planType].malocclusion.caninMolar.canin}
            </option>
          </Form.Control>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            disabled
            value={plan[planType].malocclusion.caninMolar.molar}
            custom
          >
            <option value={plan[planType].malocclusion.caninMolar.molar}>
              {textForKey('Molar')}{' '}
              {plan[planType].malocclusion.caninMolar.molar}
            </option>
          </Form.Control>
        </div>
      </td>
    </tr>
  );

  const notesRow = plan && (
    <tr>
      <td valign='top' style={{ paddingTop: '1rem', minWidth: '7rem' }}>
        {textForKey('Notes')}
      </td>
      <td
        valign='top'
        style={{
          paddingTop: '1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
      >
        {plan[planType].note}
      </td>
    </tr>
  );

  return (
    <div className='patient-treatment-plans'>
      {!plan && (
        <span className='no-data-label'>{textForKey('No treatment plan')}</span>
      )}
      {plan != null && (
        <React.Fragment>
          <div className='tabs-container'>
            <EasyTab
              onClick={() => handleTypeChange(PlanType.mandible)}
              title={textForKey('Mandible')}
              selected={planType === PlanType.mandible}
            />
            <EasyTab
              onClick={() => handleTypeChange(PlanType.maxillary)}
              title={textForKey('Maxillary')}
              selected={planType === PlanType.maxillary}
            />
          </div>
          <table>
            <tbody>
              <tr>
                <td>
                  <span className='group-title'>{textForKey('Diagnosis')}</span>
                </td>
              </tr>
              {classRow}
              {occlusionRow}
              {molarCaninRow}
              {radiographRow}
              {bracesRow}
              {treatmentTypeRow}
              {fallenBracketsRow}
              {notesRow}
            </tbody>
          </table>
        </React.Fragment>
      )}
    </div>
  );
};

export default TreatmentPlans;

TreatmentPlans.propTypes = {
  patient: PropTypes.object,
};
