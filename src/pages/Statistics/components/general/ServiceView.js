import React from 'react';

import PropTypes from 'prop-types';

import { textForKey } from '../../../../utils/localization';

const ServiceView = ({ total, color }) => {
  return (
    <div className='service-view'>
      <div className='service-row'>
        <span className='service-name'>
          {total ? textForKey('Total') : 'Service name'}
        </span>
        <div className='service-row-bars'>
          <div className='service-row'>
            <span className='service-value'>{textForKey('This month')}</span>
            <span className='service-income'>10,000 MDL</span>
            <div className='progress-wrap'>
              <div
                className='service-progress-bar'
                style={{ backgroundColor: color, width: '50%' }}
              />
              <div className='service-progress-bar-background' />
            </div>
          </div>
          <div className='service-row'>
            <span className='service-value'>
              {textForKey('Previous month')}
            </span>
            <span className='service-income'>20,000 MDL</span>
            <div className='progress-wrap'>
              <div
                className='service-progress-bar'
                style={{ backgroundColor: color, width: '100%' }}
              />
              <div className='service-progress-bar-background' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceView;

ServiceView.propTypes = {
  total: PropTypes.bool,
  color: PropTypes.string,
};

ServiceView.defaultProps = {
  color: '#93C1EF',
};
