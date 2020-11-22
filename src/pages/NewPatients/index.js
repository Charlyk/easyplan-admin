import React, { useEffect, useState } from 'react';

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
import { useDispatch } from 'react-redux';

import IconPlus from '../../assets/icons/iconPlus';
import LoadingButton from '../../components/LoadingButton';
import UploadPatientsModal from '../../components/UploadPatientsModal';
import { setPatientDetails } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import PatientRow from './comps/PatientRow';

const NewPatients = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [patients, setPatients] = useState({ total: 0, data: [] });
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchPatients();
  }, [page, rowsPerPage]);

  const fetchPatients = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchAllPatients(page, rowsPerPage);
    if (response.isError) {
      console.error(response.message);
    } else {
      setPatients(response.data);
    }
    setIsLoading(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUploadPatients = async data => {
    setIsUploading(true);
    const response = await dataAPI.uploadPatientsList(data);
    if (response.isError) {
      console.error(response.message);
    } else {
      console.log(response.data);
    }
    setIsUploading(false);
  };

  const handleStartUploadPatients = () => {
    setShowUploadModal(true);
  };

  const closeUploading = () => {
    setShowUploadModal(false);
  };

  const handleCreatePatient = () => {};

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
