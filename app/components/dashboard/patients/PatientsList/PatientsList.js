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
import ConfirmationModal from '../../../common/modals/ConfirmationModal';
import CreatePatientModal from '../CreatePatientModal';
import LoadingButton from '../../../../../components/common/LoadingButton';
import {
  setPatientDetails,
  togglePatientsListUpdate,
} from '../../../../../redux/actions/actions';
import { HeaderKeys } from "../../../../utils/constants";
import { updatePatientsListSelector } from '../../../../../redux/selectors/rootSelector';
import { textForKey } from '../../../../../utils/localization';
import { deletePatient, getPatients, importPatientsFromFile } from "../../../../../middleware/api/patients";
import CSVImportModal from "../../../common/CSVImportModal";
import PatientRow from './PatientRow';
import reducer, {
  initialState,
  setPage,
  setInitialQuery,
  setIsDeleting,
  setPatients,
  setPatientToDelete,
  setRowsPerPage,
  setSearchQuery,
  setShowCreateModal,
  setShowImportModal,
  setIsLoading,
} from './PatientsList.reducer'
import styles from './PatientsList.module.scss';

const importFields = [
  {
    id: 'firstName',
    name: `${textForKey('First name')}*`,
    required: true,
  },
  {
    id: 'lastName',
    name: `${textForKey('Last name')}*`,
    required: true,
  },
  {
    id: 'phoneNumber',
    name: `${textForKey('Phone number')}*`,
    required: true,
  },
  {
    id: 'countryCode',
    name: textForKey('Country code'),
    required: false,
  },
  {
    id: 'email',
    name: textForKey('Email'),
    required: false,
  },
  {
    id: 'gender',
    name: textForKey('Gender'),
    required: false,
  },
]

const PatientsList = ({ currentClinic, authToken, data, query: initialQuery }) => {
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
      showImportModal,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    localDispatch(setPatients(data));
    localDispatch(setInitialQuery(initialQuery));
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
    localDispatch(setIsLoading(true));
    try {
      const updatedQuery = searchQuery.replace('+', '');
      const query = { page, rowsPerPage, query: updatedQuery };
      const response = await getPatients(query);
      localDispatch(setPatients(response.data));
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsLoading(false));
    }
  };

  const handleSearchQueryChange = (event) => {
    const newQuery = event.target.value;
    localDispatch(setSearchQuery(newQuery));
  };

  const handleSearchClick = () => {
    if (page !== 0) {
      localDispatch(setPage(0));
    } else {
      fetchPatients();
    }
  };

  const handleCloseImportModal = () => {
    localDispatch(setShowImportModal(false));
  }

  const handleSearchFieldKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSearchClick();
    }
  };

  const handleChangePage = (event, newPage) => {
    localDispatch(setPage(newPage));
  };

  const handleChangeRowsPerPage = (event) => {
    localDispatch(setRowsPerPage(parseInt(event.target.value, 10)));
  };

  const handleDeletePatient = (patient) => {
    localDispatch(setPatientToDelete(patient));
  };

  const handleCloseDelete = () => {
    localDispatch(setPatientToDelete(null));
  };

  const handleDeleteConfirmed = async () => {
    if (patientToDelete == null) return;
    localDispatch(setIsDeleting(true));
    try {
      await deletePatient(patientToDelete.id);
      localDispatch(setPatientToDelete(null));
      await fetchPatients();
      dispatch(
        setPatientDetails({ show: false, patientId: null, onDelete: null }),
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsDeleting(false));
    }
  };

  const handleStartUploadPatients = () => {
    localDispatch(setShowImportModal(true));
  };

  const handleCreatePatient = () => {
    localDispatch(setShowCreateModal(true));
  };

  const handleCloseCreatePatient = () => {
    localDispatch(setShowCreateModal(false));
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

  const handleImportPatients = async (file, fields) => {
    try {
      const mappedFields = fields.map(item => ({ fieldId: item.id, index: item.index }));
      await importPatientsFromFile(file, mappedFields, {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: currentClinic.id,
        [HeaderKeys.subdomain]: currentClinic.domainName,
      });
      handleCloseImportModal();
      await fetchPatients();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.newPatientsRoot}>
      <CSVImportModal
        open={showImportModal}
        title={textForKey('Import patients')}
        importBtnTitle={textForKey('import_n_patients')}
        note={textForKey('patients_import_note')}
        fields={importFields}
        onImport={handleImportPatients}
        onClose={handleCloseImportModal}
      />
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
            <CircularProgress classes={{ root: 'circular-progress-bar' }}/>
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
            <UploadIcon/>
          </LoadingButton>
          <Button
            variant='outline-primary'
            className={styles.createBtn}
            onClick={handleCreatePatient}
          >
            {textForKey('Add patient')}
            <IconPlus fill='#00E987'/>
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
              <IconSearch/>
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
