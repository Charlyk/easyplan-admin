import React, { useEffect, useState } from "react";
import clsx from "clsx";
import sortBy from "lodash/sortBy";
import { toast } from "react-toastify";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";

import { Role } from "../../../../utils/constants";
import { fetchClinicExchangeRates } from "../../../../../middleware/api/clinic";
import formattedAmount from "../../../../../utils/formattedAmount";
import { textForKey } from "../../../../../utils/localization";
import { setIsExchangeRatesModalOpen } from "../../../../../redux/actions/exchangeRatesActions";
import { updateExchangeRatesSelector } from "../../../../../redux/selectors/rootSelector";
import styles from './ExchangeRates.module.scss';

const ExchangeRates = ({ currentClinic, currentUser }) => {
  const dispatch = useDispatch();
  const selectedClinic = currentUser.clinics.find((item) => item.clinicId === currentClinic.id);
  const clinicCurrency = currentClinic.currency;
  const updateRates = useSelector(updateExchangeRatesSelector);
  const [isLoading, setIsLoading] = useState(true);
  const [rates, setRates] = useState([]);

  useEffect(() => {
    fetchExchangeRates();
  }, [selectedClinic, updateRates]);

  const fetchExchangeRates = async () => {
    if (
      selectedClinic == null ||
      selectedClinic.roleInClinic === Role.doctor
    ) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchClinicExchangeRates();
      const sortedItems = sortBy(response.data, (item) => item.created);
      setRates(sortedItems);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenExchangeRatesModal = () => {
    dispatch(setIsExchangeRatesModalOpen(true));
  };

  return (
    <div className={styles.exchangeRate}>
      {!isLoading && (
        <Typography className={styles.titleLabel}>
          {textForKey('Exchange rate')}
        </Typography>
      )}
      {!isLoading ? (
        <TableContainer className={styles.tableContainer}>
          <Table className={styles.table}>
            <TableBody className={styles.tableBody}>
              {rates.map(rate => (
                <TableRow className={styles.tableRow} key={rate.currency}>
                  <TableCell className={styles.tableCell}>
                    <Typography className={styles.label}>
                      {rate.currency}:
                    </Typography>
                  </TableCell>
                  <TableCell className={styles.tableCell} align="right">
                    <Typography className={clsx(styles.label, styles.valueLabel)}>
                      {formattedAmount(rate.value, clinicCurrency)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className='progress-bar-wrapper'>
          <CircularProgress className='circular-progress-bar'/>
        </div>
      )}
      {!isLoading && (
        <Button className={styles.editButton} onPointerUp={handleOpenExchangeRatesModal}>
          {textForKey('Edit')}
        </Button>
      )}
    </div>
  );
};

export default ExchangeRates;
