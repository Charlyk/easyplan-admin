import React, { useEffect, useState } from 'react';

import AddNote from '../../components/AddNote';
import AddXRay from '../../components/AddXRay';
import ConfirmationModal from '../../components/ConfirmationModal';
import {
  triggerUpdateNotes,
  triggerUpdateXRay,
} from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { uploadFileToAWS } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import PatientDetails from './comps/details/PatientDetails';
import PatientsList from './comps/list/PatientsList';
import './styles.scss';
import PatientAccount from './comps/PatientAccount';

import { useDispatch } from 'react-redux';

const Patients = props => {
  const dispatch = useDispatch();
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
  const [addXRayImage, setAddXRayImage] = useState({
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
      if (response?.data?.length > 0) {
        setSelectedPatient(response.data[0]);
      }
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
    dispatch(triggerUpdateNotes());
  };

  const handleAddXRayImage = () => {
    setAddXRayImage({ open: true, isSaving: false });
  };

  const cancelAddXRayImage = () => {
    setAddXRayImage({ open: false, isSaving: false });
  };

  /**
   * Save patient x-ray image
   * @param {Object} image
   * @param {string} image.phase
   * @param {File} image.imageFile
   * @return {Promise<void>}
   */
  const handleSaveXRayImage = async image => {
    setAddXRayImage({ ...addXRayImage, isSaving: true });
    const uploadResult = await uploadFileToAWS('x-ray', image.imageFile);
    if (!uploadResult) return;
    await dataAPI.addXRayImage(selectedPatient.id, {
      imageUrl: uploadResult.location,
      type: image.phase,
    });
    setAddXRayImage({ open: false, isSaving: false });
    dispatch(triggerUpdateXRay());
  };

  return (
    <div className='patients-root'>
      <AddXRay
        onSave={handleSaveXRayImage}
        onClose={cancelAddXRayImage}
        open={addXRayImage.open}
        isSaving={addXRayImage.isSaving}
      />
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
