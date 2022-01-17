import React, { KeyboardEvent, useState, useEffect, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import EASTextField from 'app/components/common/EASTextField';
import ConfirmationModal from 'app/components/common/modals/ConfirmationModal';
import OptionsSelectionModal from 'app/components/common/modals/OptionsSelectionModal';
import { useSelector } from 'app/hooks/useTypedSelector';
import { textForKey } from 'app/utils/localization';
import onRequestError from 'app/utils/onRequestError';
import {
  getAllCabinetsInfo,
  createCabinet,
  deleteCabinet as middlewareDeleteCabinet,
  addDoctor as middlewareAddDoctor,
  deleteDoctor as middlewareDeleteDoctor,
} from 'middleware/api/cabinets';
import { activeClinicDoctorsSelector } from 'redux/selectors/appDataSelector';
import { cabinetsSelector } from 'redux/selectors/cabinetSelector';
import {
  addNewCabinet,
  setCabinets,
  deleteCabinet,
  updateCabinet,
} from 'redux/slices/cabinetsData';
import { showWarningNotification } from 'redux/slices/globalNotificationsSlice';
import CabinetItem from '../CabinetItem';
import styles from './ClinicCabinets.module.scss';

const ClinicCabinets: React.FC = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const cabinets = useSelector(cabinetsSelector);
  const currentClinicDoctors = useSelector(activeClinicDoctorsSelector);
  const [inputValue, setInputValue] = useState('');
  const [showCabinetDeleteModal, setShowCabinetDeleteModal] = useState(false);
  const [showDoctorDeleteModal, setShowDoctorDeleteModal] = useState(false);
  const [cabinetId, setCabinetId] = useState<number>(null);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [doctorDeleteData, setDoctorDeleteData] = useState<[number, number]>([
    null,
    null,
  ]);

  const fetchData = async () => {
    try {
      const { data } = await getAllCabinetsInfo();
      return data;
    } catch (err) {
      onRequestError(err);
    }
  };

  useEffect(() => {
    fetchData().then((data) => dispatch(setCabinets(data)));
  }, []);

  const handleKeyDown = async (evt: KeyboardEvent): Promise<void> => {
    if (evt.key !== 'Enter') {
      return;
    }
    try {
      const cabinetExists = cabinets.some(
        (item) => item.name.toLowerCase() === inputValue.toLowerCase(),
      );
      if (cabinetExists) {
        dispatch(showWarningNotification(textForKey('cabinet_name_exists')));
        return;
      }

      const body = {
        name: inputValue,
        users: null,
      };

      const { data } = await createCabinet(body);

      dispatch(addNewCabinet(data));
      setInputValue('');
      inputRef.current.querySelector('input').blur();
    } catch (err) {
      onRequestError(err);
    }
  };

  const handleDeleteDoctor = (cabinetId: number, doctorId: number): void => {
    setShowDoctorDeleteModal(true);
    setDoctorDeleteData([cabinetId, doctorId]);
  };

  const handleOnDoctorDeleteConfirm = async (): Promise<void> => {
    try {
      const [cabinetId, doctorId] = doctorDeleteData;
      const params = {
        id: [doctorId],
        cabinet: cabinetId,
      };
      const { data } = await middlewareDeleteDoctor(params);
      dispatch(updateCabinet(data));
      setShowDoctorDeleteModal(false);
    } catch (err) {
      onRequestError(err);
    }
  };

  const handleDeleteCabinet = (id: number): void => {
    setCabinetId(id);
    setShowCabinetDeleteModal(true);
  };

  const handleOnCabinetDeleteConfirm = async (): Promise<void> => {
    try {
      const { data } = await middlewareDeleteCabinet({ id: cabinetId });
      dispatch(deleteCabinet(data.id));
      setShowCabinetDeleteModal(false);
    } catch (err) {
      onRequestError(err);
    }
  };

  const handleAddDoctor = (id: number) => {
    setShowAddDoctorModal(true);
    setCabinetId(id);
  };

  const handleOnConfirmAddDoctors = async (selectedItemsArr) => {
    try {
      const params = {
        id: selectedItemsArr.map((doctor) => doctor.id),
        cabinet: cabinetId,
      };

      const { data } = await middlewareAddDoctor(params);
      dispatch(updateCabinet(data));
      setCabinetId(null);
      setShowAddDoctorModal(false);
    } catch (err) {
      onRequestError(err);
    }
  };

  const isDoctorAlreadyInCabinet = (doctor, cabinetId) => {
    const requiredCabinet = cabinets.find(
      (cabinet) => cabinet.id === cabinetId,
    );
    return requiredCabinet?.users?.some((user) => user.user.id === doctor?.id);
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
