import React, { useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import TablePagination from '@material-ui/core/TablePagination';
import TableContainer from '@material-ui/core/TableContainer';
import PropTypes from 'prop-types';
import UploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";

import IconPlus from '../../../icons/iconPlus';
import IconSearch from '../../../icons/iconSearch';
import LoadingButton from '../../../common/LoadingButton';
import {
  setPatientDetails,
  togglePatientsListUpdate,
} from '../../../../../redux/actions/actions';
import { HeaderKeys } from "../../../../utils/constants";
import { updatePatientsListSelector } from '../../../../../redux/selectors/rootSelector';
import { textForKey } from '../../../../utils/localization';
import {
  deletePatient,
  getPatients,
  importPatientsFromFile
} from "../../../../../middleware/api/patients";
import EASTextField from "../../../common/EASTextField";
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

const PatientRow = dynamic(() => import('./PatientRow'));
const ConfirmationModal = dynamic(() => import('../../../common/modals/ConfirmationModal'));
const CSVImportModal = dynamic(() => import("../../../common/CSVImportModal"));
const CreatePatientModal = dynamic(() => import('../CreatePatientModal'));

const importFields = [
  {
    id: 'firstName',
    name: textForKey('First name'),
    required: true,
  },
  {
    id: 'lastName',
    name: textForKey('Last name'),
    required: true,
  },
  {
    id: 'phoneNumber',
    name: textForKey('Phone number'),
    required: true,
  },
  {
    id: 'countryCode',
    name: textForKey('Country code'),
    required: true,
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

  const handleSearchQueryChange = (newValue) => {
    localDispatch(setSearchQuery(newValue));
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
        iconTitle={textForKey('upload csv file')}
        iconSubtitle={textForKey('n_contacts_only')}
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
          <Button
            variant='outlined'
            className={styles.importBtn}
            classes={{
              root: styles.importBtn,
              outlined: styles.outlinedBtnBlue
            }}
            onClick={handleStartUploadPatients}
          >
            <Typography noWrap className={styles.buttonLabel}>
              {textForKey('Import patients')}
            </Typography>
            <UploadIcon/>
          </Button>
          <Button
            variant="outlined"
            className={styles.createBtn}
            onClick={handleCreatePatient}
          >
            <Typography noWrap className={styles.buttonLabel}>
              {textForKey('Add patient')}
            </Typography>
            <IconPlus fill='#00E987'/>
          </Button>
          <div className='flexContainer'>
            <EASTextField
              type="text"
              placeholder={`${textForKey('Search patient')}...`}
              value={searchQuery || ''}
              onChange={handleSearchQueryChange}
              onKeyDown={handleSearchFieldKeyDown}
            />
            <LoadingButton
              disabled={isLoading}
              className={styles.loadingButton}
              isLoading={isLoading}
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
  currentClinic: PropTypes.object,
  data: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
};