import React, { KeyboardEvent, useState, useEffect, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import EASTextField from 'app/components/common/EASTextField';
import ConfirmationModal from 'app/components/common/modals/ConfirmationModal';
import OptionsSelectionModal from 'app/components/common/modals/OptionsSelectionModal';
import { useDispatch } from 'app/utils/hooks/useTypedDispatch';
import { useSelector } from 'app/utils/hooks/useTypedSelector';
import { textForKey } from 'app/utils/localization';
import { cabinetsSelector } from 'redux/selectors/cabinetSelector';
import { currentClinicDoctorsSelector } from 'redux/selectors/clinicSelector';
import {
  addNewCabinet,
  setCabinets,
  deleteCabinet,
  deleteDoctorFromCabinet,
  addDoctorToCabinet,
} from 'redux/slices/cabinetsData';
import CabinetItem from '../CabinetItem';
import styles from './ClinicCabinets.module.scss';
import DemoData from './demoData';

interface Props {
  id: number;
}

const ClinicCabinets: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const cabinets = useSelector(cabinetsSelector);
  const currentClinicDoctors = useSelector(currentClinicDoctorsSelector);
  const [inputValue, setInputValue] = useState('');
  const [showCabinetDeleteModal, setShowCabinetDeleteModal] = useState(false);
  const [showDoctorDeleteModal, setShowDoctorDeleteModal] = useState(false);
  const [cabinetId, setCabinetId] = useState<number>(null);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [doctorDeleteData, setDoctorDeleteData] = useState<[number, number]>([
    null,
    null,
  ]);

  useEffect(() => {
    dispatch(setCabinets(DemoData));
  }, []);

  const handleKeyDown = (evt: KeyboardEvent): void => {
    if (evt.key === 'Enter') {
      dispatch(
        addNewCabinet({ name: inputValue, id: cabinets.length + 1, users: [] }),
      );
      setInputValue('');
      inputRef.current.querySelector('input').blur();
    }
  };

  const handleDeleteDoctor = (cabinetId: number, doctorId: number): void => {
    setShowDoctorDeleteModal(true);
    setDoctorDeleteData([cabinetId, doctorId]);
  };

  const handleOnDoctorDeleteConfirm = (): void => {
    setShowDoctorDeleteModal(false);
    const [cabinetId, doctorId] = doctorDeleteData;
    dispatch(deleteDoctorFromCabinet({ cabinetId, doctorId }));
  };

  const handleDeleteCabinet = (id: number): void => {
    setCabinetId(id);
    setShowCabinetDeleteModal(true);
  };

  const handleOnCabinetDeleteConfirm = () => {
    dispatch(deleteCabinet(cabinetId));
    setShowCabinetDeleteModal(false);
  };

  const handleAddDoctor = (id: number) => {
    setShowAddDoctorModal(true);
    setCabinetId(id);
  };

  const handleOnConfirmAddDoctors = (selectedItemsArr) => {
    setShowAddDoctorModal(false);
    dispatch(addDoctorToCabinet({ cabinetId, selectedItemsArr }));
    setCabinetId(null);
  };

  const isDoctorAlreadyInCabinet = (doctor, cabinetId) => {
    const requiredCabinet = cabinets.find(
      (cabinet) => cabinet.id === cabinetId,
    );
    return requiredCabinet.users.some((user) => user.id === doctor.id);
  };

  return (
    <div className={styles.clinicCabinets}>
      <EASTextField
        fieldLabel={textForKey('clinic_cabinets_tag_field')}
        helperText={textForKey('clinic_cabinets_tag_helper')}
        onKeyDown={handleKeyDown}
        value={inputValue}
        onChange={(data: string) => setInputValue(data)}
        ref={inputRef}
      />
      <Typography className={styles.cabinetsTitle}>
        {textForKey('clinic_current_cabinets')}
      </Typography>
      <div className={styles.cabinetsContainer}>
        {cabinets.map((cabinet) => (
          <CabinetItem
            key={cabinet.id}
            cabinet={cabinet}
            handleDeleteDoctor={handleDeleteDoctor}
            handleAddDoctor={handleAddDoctor}
            handleDeleteCabinet={handleDeleteCabinet}
          />
        ))}
      </div>
      {showCabinetDeleteModal && (
        <ConfirmationModal
          show={showCabinetDeleteModal}
          title={textForKey('confirm')}
          message={`${textForKey('clinic_cabinet_confirmation_request')} ?`}
          onConfirm={handleOnCabinetDeleteConfirm}
          onClose={() => setShowCabinetDeleteModal(false)}
        />
      )}
      {showDoctorDeleteModal && (
        <ConfirmationModal
          show={showDoctorDeleteModal}
          title={textForKey('confirm')}
          message={`${textForKey(
            'clinic_cabinet_doctor_deletion_confirmation',
          )} ?`}
          onConfirm={handleOnDoctorDeleteConfirm}
          onClose={() => setShowDoctorDeleteModal(false)}
        />
      )}
      {showAddDoctorModal && (
        <OptionsSelectionModal
          iterable={currentClinicDoctors.map((item) => ({
            ...item,
            name: item.fullName,
            disabled: isDoctorAlreadyInCabinet(item, cabinetId),
          }))}
          show={showAddDoctorModal}
          title={textForKey('select doctor from the list')}
          onClose={() => setShowAddDoctorModal(false)}
          onConfirm={handleOnConfirmAddDoctors}
          destroyBtnText={textForKey('cancel_schedule')}
          primaryBtnText={textForKey('confirm')}
        />
      )}
    </div>
  );
};

export default ClinicCabinets;
