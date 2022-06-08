import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import IconClose from 'app/components/icons/iconClose';
import formattedNumber from 'app/utils/formattedNumber';
import { ChartType } from 'types/ChartType.type';
import styles from './TreatedPatientsChart.module.scss';

const TreatedPatients = ({ patients, removeable, onClose, visible = true }) => {
  const textForKey = useTranslate();
  if (!visible || patients == null) {
    return null;
  }

  const handleClose = () => {
    onClose?.(ChartType.TreatedClients);
  };

  return (
    <Grid item xs={4} className={styles.treatedPatientsChart}>
      <div className='chartItem'>
        {removeable && (
          <div className='buttonContainer'>
            <IconButton onClick={handleClose}>
              <IconClose />
            </IconButton>
          </div>
        )}
        <Typography className='chartTitle'>
          {textForKey('analytics_treated_patients')}
        </Typography>
        <div className={styles.patientsCountContainer}>
          <Typography className={styles.counterLabel}>
            {formattedNumber(patients)}%
          </Typography>
        </div>
      </div>
    </Grid>
  );
};

export default TreatedPatients;

TreatedPatients.propTypes = {
  visible: PropTypes.bool,
  patients: PropTypes.number,
  removeable: PropTypes.bool,
};
