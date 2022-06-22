import React from 'react';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import LoadingButton from 'app/components/common/LoadingButton';
import IconRefresh from 'app/components/icons/iconRefresh';
import styles from './StatisticFilter.module.scss';

const StatisticFilter = ({
  children,
  isLoading,
  onUpdate,
  btnText = 'apply',
}) => {
  const textForKey = useTranslate();
  return (
    <div className={styles.statisticsFilterRoot}>
      <div className={styles.filterOptionsWrapper}>{children}</div>
      <LoadingButton
        className={styles.submitButton}
        onClick={onUpdate}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {textForKey(btnText)} <IconRefresh fill='#fff' />
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
