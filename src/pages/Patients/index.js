import React, { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';

import ConfirmationModal from '../../components/ConfirmationModal';
import {
  setPatientNoteModal,
  setPatientXRayModal,
} from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { Action } from '../../utils/constants';
import { logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import PatientDetails from './comps/details/PatientDetails';
import PatientsList from './comps/list/PatientsList';
import './styles.scss';
import PatientAccount from './comps/PatientAccount';

const Patients = () => {
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [patients, setPatients] = useState({ all: [], filtered: [] });
  const [deletePatient, setDeletePatient] = useState({
    open: false,
    patient: null,
    isDeleting: false,
  });
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    setSelectedPatient(null);
    logUserAction(Action.ViewPatients);
    fetchPatients();
  }, []);

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsAdding(true);
  };

  const fetchPatients = async () => {
    setIsFetching(true);
    const response = await dataAPI.fetchAllPatients();
    if (response.isError) {
      console.error(response.message);
    } else {
      setPatients({ all: response.data, filtered: response.data });
      if (response?.data?.length > 0 && selectedPatient == null) {
        const patient = response.data[0];
        handlePatientSelected(patient);
      }
    }
    setIsFetching(false);
  };

  const handlePatientSave = async patientData => {
    setIsSaving(true);
    if (patientData.id != null) {
      logUserAction(
        Action.EditPatient,
        JSON.stringify({ before: selectedPatient, after: patientData }),
      );
    } else {
      logUserAction(Action.CreatePatient, JSON.stringify(patientData));
    }

    const response =
      patientData.id != null
        ? await dataAPI.updatePatient(patientData.id, patientData)
        : await dataAPI.createPatient(patientData);
    if (response.isError) {
      console.error(response.message);
    } else {
      await fetchPatients();
      handlePatientSelected(response.data);
    }
    setIsSaving(false);
  };

  const handlePatientDelete = patient => {
    setDeletePatient({ ...deletePatient, open: true, patient });
  };

  const handleCancelDelete = () => {
    setDeletePatient({ open: false, patient: null, isDeleting: false });
  };

  const handleDeleteConfirmed = async () => {
    if (deletePatient.patient == null) return;
    setDeletePatient({ ...deletePatient, isDeleting: true });
    await dataAPI.deletePatient(deletePatient.patient.id);
    logUserAction(Action.DeletePatient, JSON.stringify(deletePatient.patient));
    setSelectedPatient(null);
    await fetchPatients();
    handleCancelDelete();
  };

  const handlePatientSelected = patient => {
    logUserAction(Action.ViewPatient, JSON.stringify(patient));
    setSelectedPatient(patient);
    setIsAdding(false);
  };

  const handlePatientsSearch = searchQuery => {
    const filtered = patients.all.filter(item => {
      const fullName = `${item.firstName || ''} ${item.lastName || ''}`
        .replace(' ', '')
        .toLowerCase();
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        item.phoneNumber.includes(searchQuery)
      );
    });
    setPatients({ ...patients, filtered });
  };

  const handleCreateNote = () => {
    if (selectedPatient == null) {
      return;
    }
    dispatch(
      setPatientNoteModal({
        open: true,
        patientId: selectedPatient.id,
        mode: 'notes',
      }),
    );
  };

  const handleAddXRayImage = () => {
    if (selectedPatient == null) {
      return;
    }
    dispatch(
      setPatientXRayModal({ open: true, patientId: selectedPatient.id }),
    );
  };

  return (
    <div className='patients-root'>
      <ConfirmationModal
        show={deletePatient.open}
        isLoading={deletePatient.isDeleting}
        message={textForKey('Are you sure you want to delete this patient?')}
        title={textForKey('Delete patient')}
        onConfirm={handleDeleteConfirmed}
        onClose={handleCancelDelete}
      />
      <div className='patients-root__content'>
        <div className='patients-root__content__list'>
          <PatientsList
            isFetching={isFetching}
            onSearch={handlePatientsSearch}
            onSelect={handlePatientSelected}
            selectedPatient={selectedPatient}
            patients={patients.filtered}
            onAdd={handleAddPatient}
          />
        </div>
        <div className='patients-root__content__account'>
          {(selectedPatient || isAdding) && (
            <PatientAccount
              onSave={handlePatientSave}
              onDelete={handlePatientDelete}
              patient={selectedPatient}
              isAdding={isAdding}
              isSaving={isSaving}
            />
          )}
        </div>
        <div className='patients-root__content__details'>
          {selectedPatient && (
            <PatientDetails
              patient={selectedPatient}
              onAddNote={handleCreateNote}
              onAddXRay={handleAddXRayImage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;
