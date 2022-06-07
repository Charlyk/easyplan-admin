import React, { useContext, useEffect, useReducer, useMemo } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import UploadIcon from '@material-ui/icons/CloudUpload';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import IconPlus from 'app/components/icons/iconPlus';
import IconSearch from 'app/components/icons/iconSearch';
import NotificationsContext from 'app/context/notificationsContext';
import { HeaderKeys } from 'app/utils/constants';
import { importPatientsFromFile } from 'middleware/api/patients';
import {
  authTokenSelector,
  currentClinicSelector,
} from 'redux/selectors/appDataSelector';
import {
  globalPatientListSelector,
  arePatientsLoadingSelector,
} from 'redux/selectors/patientSelector';
import { updatePatientsListSelector } from 'redux/selectors/rootSelector';
import {
  setPatientDetails,
  toggleUpdatePatients,
} from 'redux/slices/mainReduxSlice';
import { fetchPatientList } from 'redux/slices/patientsListSlice';
import styles from './PatientsList.module.scss';
import reducer, {
  initialState,
  setPage,
  setInitialQuery,
  setRowsPerPage,
  setSearchQuery,
  setShowCreateModal,
  setShowImportModal,
} from './PatientsList.reducer';

const PatientRow = dynamic(() => import('./PatientRow'));

const CSVImportModal = dynamic(() =>
  import('app/components/common/CSVImportModal'),
);
const CreatePatientModal = dynamic(() => import('../CreatePatientModal'));

const importFields = [
  {
    id: 'firstName',
    name: 'first name',
    required: true,
  },
  {
    id: 'lastName',
    name: 'last name',
    required: true,
  },
  {
    id: 'phoneNumber',
    name: 'phone number',
    required: true,
  },
  {
    id: 'birthday',
    name: 'birthday',
    required: false,
  },
  {
    id: 'email',
    name: 'email',
    required: false,
  },
  {
    id: 'gender',
    name: 'gender',
    required: false,
  },
];

const PatientsList = ({ query: initialQuery }) => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const patients = useSelector(globalPatientListSelector);
  const isLoading = useSelector(arePatientsLoadingSelector);
  const authToken = useSelector(authTokenSelector);
  const currentClinic = useSelector(currentClinicSelector);
  const updatePatients = useSelector(updatePatientsListSelector);
  const [
    { rowsPerPage, page, showCreateModal, searchQuery, showImportModal },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const mappedImportFields = useMemo(() => {
    return importFields.map((field) => ({
      ...field,
      name: textForKey(field.name),
    }));
  }, []);

  useEffect(() => {
    localDispatch(setInitialQuery(initialQuery));
  }, []);

  useEffect(() => {
    if (updatePatients) {
      fetchPatients();
      dispatch(toggleUpdatePatients(false));
    }
  }, [updatePatients]);

  useEffect(() => {
    if (
      page === initialQuery.page &&
      rowsPerPage === initialQuery.rowsPerPage
    ) {
      return;
    }
    fetchPatients();
  }, [page, rowsPerPage]);

  const fetchPatients = async () => {
    const updatedQuery = searchQuery.replace('+', '');
    const query = { page, rowsPerPage, query: updatedQuery };
    dispatch(fetchPatientList({ query }));
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
  };

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
        canDelete: true,
      }),
    );
  };

  const handleImportPatients = async (file, fields) => {
    try {
      const mappedFields = fields.map((item) => ({
        fieldId: item.id,
        index: item.index,
      }));
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

  const translateRowsLabel = ({ from, to, count }) =>
    `${from}–${to} ${textForKey('of')} ${
      count !== -1 ? count : `more than ${to}`
    }`;

  return (
    <div className={styles.newPatientsRoot}>
      <CSVImportModal
        open={showImportModal}
        title={textForKey('Import patients')}
        importBtnTitle={textForKey('import_n_patients')}
        note={textForKey('patients_import_note')}
        iconTitle={textForKey('upload csv file')}
        iconSubtitle={textForKey('n_contacts_only')}
        fields={mappedImportFields}
        onImport={handleImportPatients}
        onClose={handleCloseImportModal}
      />
      <CreatePatientModal
        open={showCreateModal}
        currentClinic={currentClinic}
        authToken={authToken}
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
                    {textForKey('name')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography classes={{ root: styles.headerLabel }}>
                    {textForKey('phone number')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography classes={{ root: styles.headerLabel }}>
                    {textForKey('email')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography classes={{ root: styles.headerLabel }}>
                    {textForKey('source')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography classes={{ root: styles.headerLabel }}>
                    {textForKey('discount')}
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
          rowsPerPage={parseInt(rowsPerPage)}
          labelRowsPerPage={textForKey('patients per page')}
          labelDisplayedRows={translateRowsLabel}
          page={parseInt(page)}
          component='div'
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <div className={styles.actionsContainer}>
          <Button
            variant='outlined'
            className={styles.importBtn}
            classes={{
              root: styles.importBtn,
              outlined: styles.outlinedBtnBlue,
            }}
            onClick={handleStartUploadPatients}
          >
            <Typography noWrap className={styles.buttonLabel}>
              {textForKey('import patients')}
            </Typography>
            <UploadIcon />
          </Button>
          <Button
            variant='outlined'
            className={styles.createBtn}
            onClick={handleCreatePatient}
          >
            <Typography noWrap className={styles.buttonLabel}>
              {textForKey('add patient')}
            </Typography>
            <IconPlus fill='#00E987' />
          </Button>
          <div className='flexContainer'>
            <EASTextField
              type='text'
              placeholder={`${textForKey('search patient')}...`}
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
              {textForKey('search')}
              <IconSearch />
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsList;

PatientsList.propTypes = {
  currentClinic: PropTypes.object,
  query: PropTypes.object.isRequired,
};
