import React from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import IconNext from '../../../../assets/icons/iconNext';
import { clinicCurrencySelector } from '../../../../redux/selectors/clinicSelector';
import { formattedAmount } from '../../../../utils/helperFuncs';

const IncomeStatisticItem = ({ title, icon, amount }) => {
  const currency = useSelector(clinicCurrencySelector);
  return (
    <div className='income-statistic-item'>
      <div className='icon-wrapper'>{icon}</div>
      <div className='item-data-wrapper'>
        <span className='title-label'>{title}</span>
        <span className='amount-label'>
          {formattedAmount(amount, currency)}
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
  amount: PropTypes.number,
};
