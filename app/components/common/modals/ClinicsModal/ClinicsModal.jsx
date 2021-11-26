import React, { useEffect, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { textForKey } from 'app/utils/localization';
import { requestFetchAllOwnerClinics } from 'middleware/api/clinic';
import onRequestError from '../../../../utils/onRequestError';
import EASModal from '../EASModal';
import styles from './ClinicsModal.module.scss';

const ClinicsModal = ({ open, currentClinicId, onClose, onSelect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    if (open && clinics.length === 0) {
      fetchOwnerClinics();
    }
  }, [open]);

  const fetchOwnerClinics = async () => {
    setIsLoading(true);
    try {
      const response = await requestFetchAllOwnerClinics();
      setClinics(response.data.filter((item) => item.id !== currentClinicId));
    } catch (error) {
      onRequestError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClinicSelected = (clinic, event) => {
    event.stopPropagation();
    event.preventDefault();
    onSelect?.(clinic);
  };

  return (
    <EASModal
      open={open}
      hidePositiveBtn
      className={styles.clinicsModal}
      title={textForKey('Select a clinic')}
      isPositiveLoading={isLoading}
      onClose={onClose}
    >
      <MenuList>
        {clinics.map((clinic) => (
          <MenuItem
            key={clinic.id}
            onClick={(event) => handleClinicSelected(clinic, event)}
          >
            <Typography className={styles.label}>
              {clinic.clinicName}
            </Typography>
          </MenuItem>
        ))}
      </MenuList>
    </EASModal>
  );
};

export default ClinicsModal;

ClinicsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  currentClinicId: PropTypes.number,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};
