import React, { useEffect, useReducer } from 'react';

import './styles.scss';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  TablePagination,
  TableContainer,
  Box,
} from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import IconPlus from '../../assets/icons/iconPlus';
import IconSearch from '../../assets/icons/iconSearch';
import ConfirmationModal from '../../components/ConfirmationModal';
import CreatePatientModal from '../../components/CreatePatientModal';
import LoadingButton from '../../components/LoadingButton';
import SetupExcelModal, { UploadMode } from '../../components/SetupExcelModal';
import ImportDataModal from '../../components/UploadPatientsModal';
import {
  setPatientDetails,
  togglePatientsListUpdate,
} from '../../redux/actions/actions';
import { updatePatientsListSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import { UploadDestination } from '../../utils/constants';
import {
  generateReducerActions,
  uploadFileToAWS,
} from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import PatientRow from './comps/PatientRow';

const initialState = {
  isLoading: false,
  isUploading: false,
  showUploadModal: false,
  showDeleteDialog: false,
  patients: { data: [], total: 0 },
  rowsPerPage: 25,
  page: 0,
  showCreateModal: false,
  searchQuery: '',
  patientToDelete: null,
  isDeleting: false,
  excelData: null,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setIsUploading: 'setIsUploading',
  setPatients: 'setPatients',
  setRowsPerPage: 'setRowsPerPage',
  setPage: 'setPage',
  setShowUploadModal: 'setShowUploadModal',
  setShowCreateModal: 'setShowCreateModal',
  setSearchQuery: 'setSearchQuery',
  setShowDeleteDialog: 'setShowDeleteDialog',
  setPatientToDelete: 'setPatientToDelete',
  setIsDeleting: 'setIsDeleting',
  setExcelData: 'setExcelData',
};

const actions = generateReducerActions(reducerTypes);

/**
 * Patients list reducer
 * @param {Object} state
 * @param {{ type: string, payload: any }} action
 */
const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setIsUploading:
      return { ...state, isUploading: action.payload };
    case reducerTypes.setShowUploadModal:
      return { ...state, showUploadModal: action.payload };
    case reducerTypes.setPatients:
      return { ...state, patients: action.payload };
    case reducerTypes.setPage:
      return { ...state, page: action.payload };
    case reducerTypes.setRowsPerPage:
      return { ...state, rowsPerPage: action.payload, page: 0 };
    case reducerTypes.setShowCreateModal:
      return { ...state, showCreateModal: action.payload };
    case reducerTypes.setSearchQuery:
      return { ...state, searchQuery: action.payload };
    case reducerTypes.setShowDeleteDialog:
      return { ...state, showDeleteDialog: action.payload };
    case reducerTypes.setPatientToDelete:
      return {
        ...state,
        patientToDelete: action.payload,
        showDeleteDialog: Boolean(action.payload),
        isDeleting: false,
      };
    case reducerTypes.setIsDeleting:
      return { ...state, isDeleting: action.payload };
    case reducerTypes.setExcelData:
      return { ...state, excelData: action.payload };
    default:
      return state;
  }
};

const NewPatients = () => {
  const dispatch = useDispatch();
  const updatePatients = useSelector(updatePatientsListSelector);
  const [
    {
      isLoading,
      isUploading,
      showUploadModal,
      patients,
      rowsPerPage,
      page,
      showCreateModal,
      searchQuery,
      showDeleteDialog,
      patientToDelete,
      isDeleting,
      excelData,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchPatients();
  }, [page, rowsPerPage, updatePatients]);

  const fetchPatients = async () => {
    localDispatch(actions.setIsLoading(true));
    const response = await dataAPI.fetchAllPatients(
      page,
      rowsPerPage,
      searchQuery,
    );
    if (response.isError) {
      console.error(response.message);
    } else {
      localDispatch(actions.setPatients(response.data));
    }
    localDispatch(actions.setIsLoading(false));
  };

  const handleSearchQueryChange = event => {
    const newQuery = event.target.value;
    localDispatch(actions.setSearchQuery(newQuery));
  };

  const handleSearchClick = () => {
    if (page !== 0) {
      localDispatch(actions.setPage(0));
    } else {
      fetchPatients();
    }
  };

  const handleSearchFieldKeyDown = event => {
    if (event.keyCode === 13) {
      handleSearchClick();
    }
  };

  const handleChangePage = (event, newPage) => {
    localDispatch(actions.setPage(newPage));
  };

  const handleChangeRowsPerPage = event => {
    localDispatch(actions.setRowsPerPage(parseInt(event.target.value, 10)));
  };

  const handleDeletePatient = patient => {
    localDispatch(actions.setPatientToDelete(patient));
  };

  const handleCloseDelete = () => {
    localDispatch(actions.setPatientToDelete(null));
  };

  const handleDeleteConfirmed = async () => {
    if (patientToDelete == null) return;
    localDispatch(actions.setIsDeleting(true));
    const response = await dataAPI.deletePatient(patientToDelete.id);
    if (response.isError) {
      console.error(response.message);
      localDispatch(actions.setIsDeleting(false));
    } else {
      localDispatch(actions.setPatientToDelete(null));
      dispatch(togglePatientsListUpdate());
      dispatch(
        setPatientDetails({ show: false, patientId: null, onDelete: null }),
      );
    }
  };

  const handleUploadPatients = async data => {
    localDispatch(actions.setIsUploading(true));
    const fileName = data.file.name;
    const { location: fileUrl } = await uploadFileToAWS(
      'clients-uploads',
      data.file,
      true,
    );

    localDispatch(
      actions.setExcelData({
        fileName,
        fileUrl: encodeURI(fileUrl),
        destination: UploadDestination.patients,
      }),
    );
    localDispatch(actions.setIsUploading(false));
  };

  const handleStartUploadPatients = () => {
    localDispatch(actions.setShowUploadModal(true));
  };

  const closeUploading = () => {
    localDispatch(actions.setShowUploadModal(false));
  };

  const handleCreatePatient = () => {
    localDispatch(actions.setShowCreateModal(true));
  };

  const handleCloseCreatePatient = () => {
    localDispatch(actions.setShowCreateModal(false));
  };

  const handlePatientSelected = patient => {
    dispatch(
      setPatientDetails({
        show: true,
        patientId: patient.id,
        onDelete: handleDeletePatient,
      }),
    );
  };

  const closeSetupExcel = () => {
    localDispatch(actions.setExcelData(null));
  };

  return (
    <div className='new-patients-root'>
      <SetupExcelModal
        mode={UploadMode.patients}
        title={textForKey('Import patients')}
        data={excelData}
        open={excelData != null}
        onClose={closeSetupExcel}
      />
      <ConfirmationModal
        isLoading={isDeleting}
        show={showDeleteDialog}
        title={textForKey('Delete patient')}
        message={textForKey('delete_patient_message')}
        onConfirm={handleDeleteConfirmed}
        onClose={handleCloseDelete}
      />
      <ImportDataModal
        open={showUploadModal}
        onClose={closeUploading}
        onUpload={handleUploadPatients}
        title={textForKey('Import patients')}
      />
      <CreatePatientModal
        open={showCreateModal}
        onClose={handleCloseCreatePatient}
      />
      <div className='new-patients-root__content'>
        {isLoading && (
          <CircularProgress classes={{ root: 'patients-progress-bar' }} />
        )}

        <TableContainer classes={{ root: 'table-container' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow classes={{ root: 'table-head-row' }}>
                <TableCell>
                  <Typography classes={{ root: 'header-label' }}>
                    {textForKey('Name')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography classes={{ root: 'header-label' }}>
                    {textForKey('Phone number')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography classes={{ root: 'header-label' }}>
                    {textForKey('Email')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography classes={{ root: 'header-label' }}>
                    {textForKey('Discount')}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            {!isLoading && (
              <TableBody>
                {patients.data.map(patient => (
                  <PatientRow
                    key={patient.id}
                    patient={patient}
                    onSelect={handlePatientSelected}
                  />
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          colSpan={4}
          count={patients.total}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage={textForKey('Patients per page')}
          page={page}
          component='div'
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <div className='actions-container'>
          <LoadingButton
            variant='outline-primary'
            className='btn-outline-primary import-btn'
            isLoading={isUploading}
            onClick={handleStartUploadPatients}
          >
            {textForKey('Import patients')}
            <UploadIcon />
          </LoadingButton>
          <Button
            variant='outline-primary'
            className='create-btn'
            onClick={handleCreatePatient}
          >
            {textForKey('Add patient')}
            <IconPlus fill='#00E987' />
          </Button>
          <Box flex='1' display='flex'>
            <Form.Group controlId='email'>
              <InputGroup>
                <Form.Control
                  onKeyDown={handleSearchFieldKeyDown}
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                  type='text'
                  placeholder={`${textForKey('Search patient')}...`}
                />
              </InputGroup>
            </Form.Group>
            <LoadingButton
              disabled={isLoading}
              isLoading={isLoading}
              className='positive-button'
              onClick={handleSearchClick}
            >
              {textForKey('Search')}
              <IconSearch />
            </LoadingButton>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default NewPatients;
