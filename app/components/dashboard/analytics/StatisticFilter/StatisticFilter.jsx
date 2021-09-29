import React from 'react';
import PropTypes from 'prop-types';
import IconRefresh from '../../../icons/iconRefresh';
import LoadingButton from '../../../common/LoadingButton';
import { textForKey } from '../../../../../utils/localization';
import styles from './StatisticFilter.module.scss';

const StatisticFilter = ({ children, isLoading, onUpdate }) => {
  return (
    <div className={styles.statisticsFilterRoot}>
      <div className={styles.filterOptionsWrapper}>{children}</div>
      <LoadingButton
        className={styles.submitButton}
        onClick={onUpdate}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {textForKey('Apply')} <IconRefresh fill='#3A83DC' />
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
