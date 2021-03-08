import React from 'react';

import { Fade, Paper, Popper } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import IconPlus from '../../../components/icons/iconPlus';
import IconSuccess from '../../../components/icons/iconSuccess';
import { userSelector } from '../../../redux/selectors/rootSelector';
import { textForKey } from '../../../utils/localization';
import styles from './ClinicSelector.module.scss';

const ClinicSelector = ({ open, anchorEl, onClose, onCreate, onChange }) => {
  const currentUser = useSelector(userSelector);

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
