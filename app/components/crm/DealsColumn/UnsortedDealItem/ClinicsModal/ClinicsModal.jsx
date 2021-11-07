import React from "react";
import PropTypes from 'prop-types';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import { textForKey } from "../../../../../utils/localization";
import EASModal from "../../../../common/modals/EASModal";
import styles from './ClinicsModal.module.scss';

const ClinicsModal = ({ open, clinics, onClose, onSelect }) => {
  const handleClinicSelected = (clinic, event) => {
    event.stopPropagation();
    event.preventDefault();
    onSelect?.(clinic);
  }

  return (
    <EASModal
      open={open}
      hidePositiveBtn
      className={styles.clinicsModal}
      title={textForKey('Select a clinic')}
      onClose={onClose}
    >
      <MenuList>
        {clinics.map(clinic => (
          <MenuItem key={clinic.id} onClick={(event) => handleClinicSelected(clinic, event)}>
            <Typography className={styles.label}>{clinic.clinicName}</Typography>
          </MenuItem>
        ))}
      </MenuList>
    </EASModal>
  );
};

export default ClinicsModal;

ClinicsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  clinics: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    clinicName: PropTypes.string,
    logoUrl: PropTypes.string,
    timeZone: PropTypes.string,
  }))
}
