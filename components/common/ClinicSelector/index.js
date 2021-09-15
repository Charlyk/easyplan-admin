import React from 'react';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconPlus from '../../../app/components/icons/iconPlus';
import IconSuccess from '../../../app/components/icons/iconSuccess';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/ClinicSelector.module.scss';

const ClinicSelector = ({ open, anchorEl, onClose, onCreate, onChange, currentUser }) => {
  if (!currentUser) return null;

  const handleCompanySelected = company => {
    onChange(company);
    onClose();
  };

  return (
    <Popper
      className={styles['companies-popper-root']}
      anchorEl={anchorEl}
      disablePortal
      open={open}
      placement='bottom'
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={styles['companies-paper']}>
            <div className={styles['options-wrapper']}>
              {currentUser?.clinics.map(clinic => (
                <div
                  role='button'
                  tabIndex={0}
                  onClick={() => handleCompanySelected(clinic)}
                  key={clinic.id}
                  className={clsx(
                    styles.option,
                    styles.clinic,
                    clinic.isSelected && styles.selected,
                  )}
                >
                  {clinic.clinicName} <IconSuccess fill='#3A83DC' />
                </div>
              ))}
              <div
                role='button'
                tabIndex={0}
                className={styles.option}
                onClick={onCreate}
              >
                <IconPlus fill='#34344E' />
                {textForKey('Create clinic')}
              </div>
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
