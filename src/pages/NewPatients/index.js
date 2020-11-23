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
} from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import IconPlus from '../../assets/icons/iconPlus';
import CreatePatientModal from '../../components/CreatePatientModal';
import LoadingButton from '../../components/LoadingButton';
import UploadPatientsModal from '../../components/UploadPatientsModal';
import { setPatientDetails } from '../../redux/actions/actions';
import { updatePatientsListSelector } from '../../redux/selectors/rootSelector';
import dataAPI from '../../utils/api/dataAPI';
import { generateReducerActions } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import PatientRow from './comps/PatientRow';

const initialState = {
  isLoading: false,
  isUploading: false,
  showUploadModal: false,
  patients: { data: [], total: 0 },
  rowsPerPage: 25,
  page: 0,
  showCreateModal: false,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setIsUploading: 'setIsUploading',
  setPatients: 'setPatients',
  setRowsPerPage: 'setRowsPerPage',
  setPage: 'setPage',
  setShowUploadModal: 'setShowUploadModal',
  setShowCreateModal: 'setShowCreateModal',
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
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchPatients();
  }, [page, rowsPerPage, updatePatients]);

  const fetchPatients = async () => {
    localDispatch(actions.setIsLoading(true));
    const response = await dataAPI.fetchAllPatients(page, rowsPerPage);
    if (response.isError) {
      console.error(response.message);
    } else {
      localDispatch(actions.setPatients(response.data));
    }
    localDispatch(actions.setIsLoading(false));
  };

  const handleChangePage = (event, newPage) => {
    localDispatch(actions.setPage(newPage));
  };

  const handleChangeRowsPerPage = event => {
    localDispatch(actions.setRowsPerPage(parseInt(event.target.value, 10)));
  };

  const handleUploadPatients = async data => {
    localDispatch(actions.setIsUploading(true));
    const response = await dataAPI.uploadPatientsList(data);
    if (response.isError) {
      console.error(response.message);
    } else {
      console.log(response.data);
    }
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
    dispatch(setPatientDetails({ show: true, patientId: patient.id }));
  };

  return (
    <div className='new-patients-root'>
      <UploadPatientsModal
        open={showUploadModal}
        onClose={closeUploading}
        onUpload={handleUploadPatients}
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
        </div>
      </div>
    </div>
  );
};

export default NewPatients;
