import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import LeftSideModal from "../../../../common/LeftSideModal";
import { textForKey } from "../../../../../utils/localization";
import formattedAmount from "../../../../../utils/formattedAmount";
import getServiceName from "../../../../../utils/getServiceName";
import styles from './ServicesListModal.module.scss';

const ServicesListModal = ({ open, currency, onClose, statistic }) => {
  const doctor = statistic?.doctor;

  const getDoctorAmount = useCallback((service) => {
    let doctorAmount = 0;
    if (service.doctorPrice != null) {
      doctorAmount = service.doctorPrice;
    } else if (service.doctorPercentage != null) {
      doctorAmount = service.price * service.doctorPercentage / 100;
    }
    return doctorAmount;
  }, [])

  const totalPrice = useMemo(() => {
    if (statistic == null) {
      return 0
    }

    return sumBy(statistic.services, item => item.price);
  }, [statistic]);

  const doctorAmount = useMemo(() => {
    if (statistic == null) {
      return 0
    }

    return sumBy(statistic.services, getDoctorAmount);
  }, [statistic, getDoctorAmount]);

  const renderServiceRow = (service, index) => {
    let doctorAmount = getDoctorAmount(service);
    return (
      <TableRow key={`${service.id}-${index}`}>
        <TableCell>{getServiceName(service)}</TableCell>
        <TableCell align="right">
          {formattedAmount(service.price, service.currency)}
        </TableCell>
        <TableCell align="right">
          {formattedAmount(doctorAmount, service.currency)}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <LeftSideModal
      show={open}
      onClose={onClose}
      className={styles.servicesList}
      title={textForKey('Completed services')}
      steps={[doctor?.fullName, textForKey('Completed services')]}
    >
      <TableContainer className={styles.tableContainer}>
        <Table stickyHeader className={styles.dataTable}>
          <TableHead>
            <TableRow>
              <TableCell>
                {textForKey('Service')}
              </TableCell>
              <TableCell align="right">
                {textForKey('Price')}
              </TableCell>
              <TableCell align="right">
                {textForKey('Doctor part')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statistic?.services.map(renderServiceRow)}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} align="right">
                {formattedAmount(totalPrice, currency)}
              </TableCell>
              <TableCell align="right">
                {formattedAmount(doctorAmount, currency)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </LeftSideModal>
  )
}

export default ServicesListModal;

ServicesListModal.propTypes = {
  open: PropTypes.bool,
  currency: PropTypes.string,
  statistic: PropTypes.shape({
    clinicAmount: PropTypes.number,
    doctor: {
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      fullName: PropTypes.string,
    },
    doctorAmount: PropTypes.number,
    services: {
      count: PropTypes.number,
      currency: PropTypes.string,
      destination: PropTypes.string,
      doctorPercentage: PropTypes.string,
      doctorPrice: PropTypes.string,
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      toothId: PropTypes.string,
    }
  }),
  onClose: PropTypes.func,
};
