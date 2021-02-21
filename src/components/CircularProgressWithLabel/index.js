import React from 'react';

import { CircularProgress, Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

import styles from './CircularProgressWithLabel.module.scss';

const CircularProgressWithLabel = props => {
  return (
    <Box
      className={styles['circular-progress-with-label']}
      position='relative'
      display='inline-flex'
    >
      <CircularProgress
        classes={{ root: styles['label-progress-bar'] }}
        variant='determinate'
        {...props}
      />
      <Box className={styles['value-wrapper']}>
        <Typography
          variant='caption'
          component='div'
          color='textSecondary'
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};
