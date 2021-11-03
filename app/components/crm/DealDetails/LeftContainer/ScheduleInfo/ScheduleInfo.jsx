import React, { useMemo } from "react";
import PropTypes from 'prop-types';
import moment from "moment-timezone";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";

import { ScheduleStatuses } from "../../../../../utils/constants";
import { textForKey } from "../../../../../utils/localization";
import styles from "./ScheduleInfo.module.scss";

const ScheduleInfo = ({ deal }) => {
  const { schedule } = deal;
  const scheduleStatus = ScheduleStatuses.find(item => item.id === schedule.status)

  const doctorName = useMemo(() => {
    const { doctor } = schedule;
    return `${doctor.firstName} ${doctor.lastName}`
  }, [schedule.doctor]);

  return (
    <div className={styles.scheduleInfo}>
      <Typography className={styles.titleLabel}>
        {textForKey('Appointment')}
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography className={styles.rowTitle}>
                  {textForKey('Budget')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography className={styles.rowValue}>
                  {deal.service.price} {deal.service.currency}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography className={styles.rowTitle}>
                  {textForKey('Doctor')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography className={styles.rowValue}>
                  {doctorName}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography className={styles.rowTitle}>
                  {textForKey('Service')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography className={styles.rowValue}>
                  {deal.service.name}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography className={styles.rowTitle}>
                  {textForKey('Status')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography className={styles.rowValue}>
                  {scheduleStatus.name}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography className={styles.rowTitle}>
                  {textForKey('Date')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography className={styles.rowValue}>
                  {moment(schedule.dateAndTime).format('DD.MM.YYYY')}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography className={styles.rowTitle}>
                  {textForKey('Hour')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography className={styles.rowValue}>
                  {moment(schedule.dateAndTime).format('HH:mm')} -{' '}
                  {moment(schedule.endTime).format('HH:mm')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
};

export default ScheduleInfo;

ScheduleInfo.propTypes = {
  deal: PropTypes.shape({
    contact: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      phoneNumber: PropTypes.string,
      photoUrl: PropTypes.string
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
      status: PropTypes.string,
      doctor: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
  }),
}
