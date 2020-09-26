import React, { useEffect, useState } from 'react';

import AddNote from '../../components/AddNote';
import ConfirmationModal from '../../components/ConfirmationModal';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import PatientDetails from './comps/details/PatientDetails';
import PatientsList from './comps/list/PatientsList';
import './styles.scss';
import PatientAccount from './comps/PatientAccount';

const Patients = props => {
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [patients, setPatients] = useState({ all: [], filtered: [] });
  const [deletePatient, setDeletePatient] = useState({
    open: false,
    patient: null,
    isDeleting: false,
  });
  const [createNote, setCreateNote] = useState({
    open: false,
    isSaving: false,
  });
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, [props]);

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsAdding(true);
  };

  const fetchPatients = async () => {
    const response = await dataAPI.fetchAllPatients();
    if (response.isError) {
      console.error(response.message);
    } else {
      setPatients({ all: response.data, filtered: response.data });
    }
  };

  const handlePatientSave = async patientData => {
    setIsSaving(true);
    const response = patientData.id
      ? await dataAPI.updatePatient(patientData.id, patientData)
      : await dataAPI.createPatient(patientData);
    if (response.isError) {
      console.error(response.message);
    } else {
      handlePatientSelected(response.data);
      await fetchPatients();
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
    await fetchPatients();
    setSelectedPatient(null);
    handleCancelDelete();
  };

  const handlePatientSelected = patient => {
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
    setCreateNote({ open: true, isSaving: false });
  };

  const cancelCreateNote = () => {
    setCreateNote({ open: false, isSaving: false });
  };

  const handleSaveNote = async noteText => {
    if (selectedPatient == null) return;
    setCreateNote({ ...createNote, isSaving: true });
    await dataAPI.createPatientNote(selectedPatient.id, { note: noteText });
    setCreateNote({ open: false, isSaving: false });
  };

  return (
    <div className='patients-root'>
      <AddNote
        onClose={cancelCreateNote}
        open={createNote.open}
        isSaving={createNote.isSaving}
        onSave={handleSaveNote}
      />
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
              shouldUpdate={!createNote.isSaving}
              patient={selectedPatient}
              onAddNote={handleCreateNote}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;
