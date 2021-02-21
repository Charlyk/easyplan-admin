import React from 'react';

import { Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

import { textForKey } from '../../../utils/localization';
import LoadingButton from '../../LoadingButton';
import styles from './DataMigrationFinalStep.module.scss';

const DataMigrationFinalStep = ({ onStart }) => {
  const handleStartImport = () => {
    onStart();
  };
  return (
    <Box
      display='flex'
      flexDirection='column'
      width='50%'
      alignItems='center'
      className={styles['import-final-step']}
    >
      <Typography classes={{ root: styles['form-title'] }}>
        {textForKey('We are ready to start')}!
      </Typography>
      <Typography classes={{ root: styles['import-message'] }}>
        {textForKey('start_migration_message')}
      </Typography>
      <LoadingButton onClick={handleStartImport} className='positive-button'>
        {textForKey('Start')}
      </LoadingButton>
    </Box>
  );
};

export default DataMigrationFinalStep;

DataMigrationFinalStep.propTypes = {
  onStart: PropTypes.func,
};

DataMigrationFinalStep.defaultProps = {
  onStart: () => null,
};
