import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import LoadingButton from 'app/components/common/LoadingButton';
import styles from './DataMigrationFinalStep.module.scss';

const DataMigrationFinalStep = ({ onStart }) => {
  const textForKey = useTranslate();
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
        {textForKey('we are ready to start')}!
      </Typography>
      <Typography classes={{ root: styles['import-message'] }}>
        {textForKey('start_migration_message')}
      </Typography>
      <LoadingButton onClick={handleStartImport} className='positive-button'>
        {textForKey('start')}
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
