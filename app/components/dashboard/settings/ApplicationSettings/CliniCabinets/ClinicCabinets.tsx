import React, { KeyboardEvent, useState, useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import EASTextField from 'app/components/common/EASTextField';
import ConfirmationModal from 'app/components/common/modals/ConfirmationModal';
import IconDelete from 'app/components/icons/iconDelete';
import IconEdit from 'app/components/icons/iconEdit';
import { useDispatch } from 'app/utils/hooks/useTypedDispatch';
import { useSelector } from 'app/utils/hooks/useTypedSelector';
import { textForKey } from 'app/utils/localization';
import { cabinetsSelector } from 'redux/selectors/cabinetSelector';
import {
  addNewCabinet,
  setCabinets,
  deleteCabinet,
  deleteDoctorFromCabinet,
} from 'redux/slices/cabinetsData';
import styles from './ClinicCabinets.module.scss';
import DemoData from './demoData';

interface Props {
  id: number;
}

const ClinicCabinets: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const cabinets = useSelector(cabinetsSelector);
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [cabinetId, setCabinetId] = useState(null);

  useEffect(() => {
    dispatch(setCabinets(DemoData));
  }, []);

  const handleKeyDown = (evt: KeyboardEvent): void => {
    if (evt.key === 'Enter') {
      dispatch(addNewCabinet({ name: inputValue }));
    }
  };

  const handleDeleteDoctor = (cabinetId, doctorId) => {
    dispatch(deleteDoctorFromCabinet({ cabinetId, doctorId }));
  };

  const handleDeleteCabinet = (id) => {
    setCabinetId(id);
    setShowModal(true);
  };

  const handleOnConfirm = () => {
    dispatch(deleteCabinet(cabinetId));
    setShowModal(false);
  };

  return (
    <div className={styles.clinicCabinets}>
      <EASTextField
        fieldLabel={textForKey('clinic_cabinets_tag_field')}
        helperText={textForKey('clinic_cabinets_tag_helper')}
        onKeyDown={handleKeyDown}
        value={inputValue}
        onChange={(data: string) => setInputValue(data)}
      />
      <Typography className={styles.cabinetsTitle}>
        {textForKey('clinic_current_cabinets')}
      </Typography>
      <div className={styles.cabinetsContainer}>
        {cabinets.map((cabinet) => (
          <div key={cabinet.id} className={styles.cabinet}>
            <div className={styles.cabinetTitleWrapper}>
              <IconButton>
                <IconEdit fill='#3A83DC' />
              </IconButton>
              <IconButton onClick={() => handleDeleteCabinet(cabinet.id)}>
                <IconDelete fill='#ec3276' />
              </IconButton>
              <h4 className={styles.cabinetTitle}>{cabinet.name}</h4>
            </div>
            <div className={styles.cabinetDoctorsContainer}>
              {cabinet.users.map((user) => {
                return (
                  <Chip
                    key={user.id}
                    label={user.fullName}
                    classes={{
                      root: styles.doctor,
                      outlined: styles.outlined,
                      label: styles.label,
                      deleteIcon: styles.deleteIcon,
                    }}
                    variant='outlined'
                    onDelete={() => handleDeleteDoctor(cabinet.id, user.id)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <ConfirmationModal
          show={showModal}
          title={textForKey('confirm')}
          message={`${textForKey('clinic_cabinet_confirmation_request')} ?`}
          onConfirm={handleOnConfirm}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ClinicCabinets;
