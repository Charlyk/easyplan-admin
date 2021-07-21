import React, { useEffect, useReducer } from 'react';

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
import PropTypes from 'prop-types';
import UploadIcon from '@material-ui/icons/CloudUpload';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import clsx from "clsx";
import { toast } from "react-toastify";

import IconPlus from '../../../../../components/icons/iconPlus';
import IconSearch from '../../../../../components/icons/iconSearch';
import ConfirmationModal from '../../../common/ConfirmationModal';
import CreatePatientModal from '../CreatePatientModal';
import LoadingButton from '../../../../../components/common/LoadingButton';
import {
  setPatientDetails,
  toggleImportModal,
  togglePatientsListUpdate,
} from '../../../../../redux/actions/actions';
import { updatePatientsListSelector } from '../../../../../redux/selectors/rootSelector';
import { textForKey } from '../../../../../utils/localization';
import PatientRow from './PatientRow';
import { deletePatient, getPatients } from "../../../../../middleware/api/patients";
import { reducer, initialState, actions } from './PatientsList.reducer'
import styles from './PatientsList.module.scss';

const PatientsList = ({ currentClinic, data, query: initialQuery }) => {
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
    if (currentClinic == null) {
      return;
    }
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
    <div className={styles.newPatientsRoot}>
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
        <div className={styles.content}>
          {isLoading && (
            <div className='progress-bar-wrapper'>
              <CircularProgress classes={{ root: 'circular-progress-bar' }} />
            </div>
          )}

          <TableContainer classes={{ root: styles.tableContainer }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow classes={{ root: styles.tableHeadRow }}>
                  <TableCell>
                    <Typography classes={{ root: styles.headerLabel }}>
                      {textForKey('Name')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography classes={{ root: styles.headerLabel }}>
                      {textForKey('Phone number')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography classes={{ root: styles.headerLabel }}>
                      {textForKey('Email')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography classes={{ root: styles.headerLabel }}>
                      {textForKey('Discount')}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              {!isLoading && (
                <TableBody>
                  {patients?.data?.map((patient) => (
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
          <div className={styles.actionsContainer}>
            <LoadingButton
              variant='outline-primary'
              className={clsx('btn-outline-primary', styles.importBtn)}
              isLoading={isUploading}
              onClick={handleStartUploadPatients}
            >
              {textForKey('Import patients')}
              <UploadIcon />
            </LoadingButton>
            <Button
              variant='outline-primary'
              className={styles.createBtn}
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
  );
}

export default PatientsList;

PatientsList.propTypes = {
  currentClinic: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
};
