import React from 'react';

import PropTypes from 'prop-types';

import IconNext from '../../../../assets/icons/iconNext';
import { textForKey } from '../../../../utils/localization';

const IncomeStatisticItem = ({ title, icon, persons, amount }) => {
  return (
    <div className='income-statistic-item'>
      <div className='icon-wrapper'>{icon}</div>
      <div className='item-data-wrapper'>
        <span className='title-label'>{title}</span>
        <span className='amount-label'>
          {persons} {textForKey('persons')} / {amount} MDL
        </span>
      </div>
      <div className='next-button'>
        <IconNext />
      </div>
    </div>
  );
};

export default IncomeStatisticItem;

IncomeStatisticItem.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.element,
  persons: PropTypes.number,
  amount: PropTypes.string,
};
