import React from 'react';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import IconNext from 'app/components/icons/iconNext';
import styles from '../GeneralAnalytics.module.scss';

const IncomeStatisticItem = ({ title, icon, persons, amount }) => {
  const textForKey = useTranslate();
  return (
    <div className={styles['income-statistic-item']}>
      <div className={styles['icon-wrapper']}>{icon}</div>
      <div className={styles['item-data-wrapper']}>
        <span className={styles['title-label']}>{title}</span>
        <span className={styles['amount-label']}>
          {persons} {textForKey('persons')}
        </span>
        <span className={styles['amount-label']}>{Math.round(amount)} MDL</span>
      </div>
      <div className={styles['next-button']}>
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
