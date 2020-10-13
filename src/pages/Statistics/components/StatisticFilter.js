import React from 'react';

import PropTypes from 'prop-types';

import IconRefresh from '../../../assets/icons/iconRefresh';
import LoadingButton from '../../../components/LoadingButton';
import { textForKey } from '../../../utils/localization';

const StatisticFilter = ({ children, isLoading, onUpdate }) => {
  return (
    <div className='statistics-filter-root'>
      <div className='filter-options-wrapper'>{children}</div>
      <LoadingButton
        className='submit-button'
        onClick={onUpdate}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {textForKey('Update')} <IconRefresh fill='#3A83DC' />
      </LoadingButton>
    </div>
  );
};

export default StatisticFilter;

StatisticFilter.propTypes = {
  isLoading: PropTypes.bool,
  children: PropTypes.any,
  onUpdate: PropTypes.func,
};

StatisticFilter.defaultProps = {
  onUpdate: () => null,
};
