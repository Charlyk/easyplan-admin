import React from 'react';

import IconAvatar from '../../../../assets/icons/iconAvatar';
import IconNext from '../../../../assets/icons/iconNext';
import { textForKey } from '../../../../utils/localization';

const PatientItem = props => {
  return (
    <div className='patient-item-root'>
      <div className='item-header'>
        <IconAvatar />
        <span className='patient-name'>Eduard Albu</span>
      </div>
      <div className='item-data'>
        <div className='row-wrapper'>
          <span className='row-title'>{textForKey('Treatment')}:</span>
          <span className='row-value'>Some text</span>
        </div>
        <div className='row-wrapper'>
          <span className='row-title'>{textForKey('Treatment type')}:</span>
          <span className='row-value'>Some text</span>
        </div>
        <div className='row-wrapper'>
          <span className='row-title'>{textForKey('Diagnostic')}:</span>
          <span className='row-value'>Some text</span>
        </div>
        <div className='row-wrapper'>
          <span className='row-title'>{textForKey('Doctor')}:</span>
          <span className='row-value'>Some text</span>
        </div>
      </div>
      <div className='details-button'>
        <span className='button-text'>{textForKey('View')}</span>
        <IconNext circleColor='transparent' />
      </div>
    </div>
  );
};

export default PatientItem;
