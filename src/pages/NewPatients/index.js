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
  TableFooter,
  TablePagination,
  TableContainer,
} from '@material-ui/core';

import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import PatientRow from './comps/PatientRow';

const NewPatients = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchAllPatients();
    if (response.isError) {
      console.error(response.message);
    } else {
      console.log(response.data);
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

  return (
    <div className='new-patients-root'>
      <div className='new-patients-root__content'>
        {isLoading && (
          <CircularProgress classes={{ root: 'patients-progress-bar' }} />
        )}
        {!isLoading && (
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
              <TableBody>
                {patients.map(patient => (
                  <PatientRow key={patient.id} patient={patient} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          colSpan={4}
          count={patients.length}
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
      </div>
    </div>
  );
};

export default NewPatients;
