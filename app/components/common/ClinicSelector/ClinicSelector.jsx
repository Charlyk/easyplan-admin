import React from 'react';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import IconPlus from 'app/components/icons/iconPlus';
import IconSuccess from 'app/components/icons/iconSuccess';
import styles from './ClinicSelector.module.scss';

const ClinicSelector = ({
  open,
  anchorEl,
  onClose,
  onCreate,
  onChange,
  currentUser,
}) => {
  const textForKey = useTranslate();
  if (!currentUser) return null;

  const handleCompanySelected = (company) => {
    onChange(company);
    onClose();
  };

  return (
    <Popper
      className={styles.companiesPopperRoot}
      anchorEl={anchorEl}
      disablePortal
      open={open}
      placement='bottom'
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={styles.companiesPaper}>
            <div className={styles.optionsWrapper}>
              {currentUser?.clinics.map((clinic) => (
                <Box
                  onClick={() => handleCompanySelected(clinic)}
                  key={clinic.id}
                  className={clsx(
                    styles.option,
                    styles.clinic,
                    clinic.isSelected && styles.selected,
                  )}
                >
                  <Typography noWrap className={styles.clinicNameText}>
                    {clinic.clinicName}
                  </Typography>
                  <IconSuccess fill='#3A83DC' />
                </Box>
              ))}
              <Box className={styles.option} onClick={onCreate}>
                <IconPlus fill='#34344E' />
                {textForKey('Create clinic')}
              </Box>
            </div>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default ClinicSelector;

ClinicSelector.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  onChange: PropTypes.func,
  anchorEl: PropTypes.any,
};
