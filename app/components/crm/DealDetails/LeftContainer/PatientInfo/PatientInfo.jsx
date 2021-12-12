import React, { useMemo } from 'react';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import IconLink from 'app/components/icons/iconLink';
import getPatientName from 'app/utils/getPatientName';
import { textForKey } from 'app/utils/localization';
import styles from './PatientInfo.module.scss';

const PatientInfo = ({ deal, onLink }) => {
  const patientName = useMemo(() => {
    if (deal == null) {
      return '';
    }
    if (deal?.patient == null) {
      return deal?.contact.name;
    }
    const { patient } = deal;
    return getPatientName(patient);
  }, [deal]);

  const patientPhone = useMemo(() => {
    if (deal?.patient == null) {
      if (deal?.contact?.phoneNumber?.startsWith('+')) {
        return deal?.contact?.phoneNumber || '-';
      } else {
        return deal?.contact?.phoneNumber
          ? `+${deal?.contact?.phoneNumber}`
          : '-';
      }
    }
    const { patient } = deal;
    return patient.phoneWithCode;
  }, [deal]);

  return (
    <div className={styles.patientInfo}>
      <Typography className={styles.titleLabel}>
        {textForKey('Patient')}
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography className={styles.rowTitle}>
                  {textForKey('Name')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography className={styles.rowValue}>
                  {patientName}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography className={styles.rowTitle}>
                  {textForKey('Phone')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography className={styles.rowValue}>
                  <a href={`tel:${patientPhone.replace('+', '')}`}>
                    {patientPhone}
                  </a>
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {deal?.patient == null && (
        <Button className={styles.linkPatientBtn} onPointerUp={onLink}>
          <IconLink fill='#3A83DC' />
          {textForKey('link_patient')}
        </Button>
      )}
    </div>
  );
};

export default PatientInfo;

PatientInfo.propTypes = {
  deal: PropTypes.shape({
    contact: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      photoUrl: PropTypes.string,
    }),
    patient: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      phoneWithCode: PropTypes.string,
    }),
    schedule: PropTypes.shape({
      id: PropTypes.number,
      created: PropTypes.string,
      dateAndTime: PropTypes.string,
      endTime: PropTypes.string,
      canceledReason: PropTypes.string,
      doctor: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
  onLink: PropTypes.func,
};
