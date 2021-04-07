import React, { useEffect, useReducer } from 'react';

import styles from '../../styles/NewPatients.module.scss';
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
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import IconPlus from '../../components/icons/iconPlus';
import IconSearch from '../../components/icons/iconSearch';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import CreatePatientModal from '../../components/patients/CreatePatientModal';
import LoadingButton from '../../components/common/LoadingButton';
import {
  setPatientDetails,
  toggleImportModal,
  togglePatientsListUpdate,
} from '../../redux/actions/actions';
import { updatePatientsListSelector } from '../../redux/selectors/rootSelector';
import {
  generateReducerActions,
  handleRequestError, redirectToUrl, redirectUserTo,
} from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import PatientRow from '../../components/patients/PatientRow';
import clsx from "clsx";
import MainComponent from "../../components/common/MainComponent";
import { toast } from "react-toastify";
import { deletePatient, getPatients } from "../../middleware/api/patients";
import { fetchAppData } from "../../middleware/api/initialization";

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
  setInitialQuery: 'setInitialQuery',
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
    case reducerTypes.setInitialQuery: {
      const { page, rowsPerPage } = action.payload;
      return {
        ...state,
        page,
        rowsPerPage,
      }
    }
    default:
      return state;
  }
};

const NewPatients = ({ currentUser, currentClinic, data, query: initialQuery }) => {
  const dispatch = useDispatch();
  const updatePatients = useSelector(updatePatientsListSelector);
  const [
    {
      isLoading,
      isUploading,
      patients,
      rowsPerPage,
      page,
      showCreateModal,
      searchQuery,
      showDeleteDialog,
      patientToDelete,
      isDeleting,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    localDispatch(actions.setPatients(data));
    localDispatch(actions.setInitialQuery(initialQuery));
  }, []);

  useEffect(() => {
    if (updatePatients) {
      fetchPatients();
      dispatch(togglePatientsListUpdate(false));
    }
  }, [updatePatients]);

  useEffect(() => {
    if (page === initialQuery.page && rowsPerPage === initialQuery.rowsPerPage) {
      return;
    }
    fetchPatients();
  }, [page, rowsPerPage]);

  const fetchPatients = async () => {
    localDispatch(actions.setIsLoading(true));
    try {
      const updatedQuery = searchQuery.replace('+', '');
      const query = { page, rowsPerPage, query: updatedQuery };
      const response = await getPatients(query);
      localDispatch(actions.setPatients(response.data));
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  };

  const handleSearchQueryChange = (event) => {
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

  const handleSearchFieldKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSearchClick();
    }
  };

  const handleChangePage = (event, newPage) => {
    localDispatch(actions.setPage(newPage));
  };

  const handleChangeRowsPerPage = (event) => {
    localDispatch(actions.setRowsPerPage(parseInt(event.target.value, 10)));
  };

  const handleDeletePatient = (patient) => {
    localDispatch(actions.setPatientToDelete(patient));
  };

  const handleCloseDelete = () => {
    localDispatch(actions.setPatientToDelete(null));
  };

  const handleDeleteConfirmed = async () => {
    if (patientToDelete == null) return;
    localDispatch(actions.setIsDeleting(true));
    try {
      await deletePatient(patientToDelete.id);
      localDispatch(actions.setPatientToDelete(null));
      await fetchPatients();
      dispatch(
        setPatientDetails({ show: false, patientId: null, onDelete: null }),
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(actions.setIsDeleting(false));
    }
  };

  const handleStartUploadPatients = () => {
    dispatch(toggleImportModal(true));
  };

  const handleCreatePatient = () => {
    localDispatch(actions.setShowCreateModal(true));
  };

  const handleCloseCreatePatient = () => {
    localDispatch(actions.setShowCreateModal(false));
  };

  const handlePatientSelected = (patient) => {
    dispatch(
      setPatientDetails({
        show: true,
        patientId: patient.id,
        onDelete: handleDeletePatient,
      }),
    );
  };

  return (
    <MainComponent
      currentClinic={currentClinic}
      currentUser={currentUser}
      currentPath='/patients'
    >
      <div className={styles['new-patients-root']}>
        <ConfirmationModal
          isLoading={isDeleting}
          show={showDeleteDialog}
          title={textForKey('Delete patient')}
          message={textForKey('delete_patient_message')}
          onConfirm={handleDeleteConfirmed}
          onClose={handleCloseDelete}
        />
        <CreatePatientModal
          open={showCreateModal}
          onClose={handleCloseCreatePatient}
        />
        <div className={styles['new-patients-root__content']}>
          {isLoading && (
            <div className='progress-bar-wrapper'>
              <CircularProgress classes={{ root: 'circular-progress-bar' }} />
            </div>
          )}

          <TableContainer classes={{ root: styles['table-container'] }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow classes={{ root: styles['table-head-row'] }}>
                  <TableCell>
                    <Typography classes={{ root: styles['header-label'] }}>
                      {textForKey('Name')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography classes={{ root: styles['header-label'] }}>
                      {textForKey('Phone number')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography classes={{ root: styles['header-label'] }}>
                      {textForKey('Email')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography classes={{ root: styles['header-label'] }}>
                      {textForKey('Discount')}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              {!isLoading && (
                <TableBody>
                  {patients.data.map((patient) => (
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
          <div className={styles['actions-container']}>
            <LoadingButton
              variant='outline-primary'
              className={clsx(styles['btn-outline-primary'], styles['import-btn'])}
              isLoading={isUploading}
              onClick={handleStartUploadPatients}
            >
              {textForKey('Import patients')}
              <UploadIcon />
            </LoadingButton>
            <Button
              variant='outline-primary'
              className={styles['create-btn']}
              onClick={handleCreatePatient}
            >
              {textForKey('Add patient')}
              <IconPlus fill='#00E987' />
            </Button>
            <div className='flexContainer'>
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
            </div>
          </div>
        </div>
      </div>
    </MainComponent>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
  try {
    if (query.page == null) {
      query.page = 0;
    }
    if (query.rowsPerPage == null) {
      query.rowsPerPage = 25;
    }
    const appData = await fetchAppData(req.headers);
    const { currentUser, currentClinic } = appData;
    const redirectTo = redirectToUrl(currentUser, currentClinic, '/patients');
    if (redirectTo != null) {
      redirectUserTo(redirectTo, res);
      return { props: { ...appData } };
    }

    const response = await getPatients(query, req.headers);
    const { data } = response;
    return {
      props: {
        query,
        data,
        ...appData
      },
    };
  } catch (error) {
    console.error(error.message)
    await handleRequestError(error, req, res);
    return {
      props: {
        query,
        data: {
          patients: [],
          total: 0,
        },
      },
    };
  }
}

export default NewPatients;
