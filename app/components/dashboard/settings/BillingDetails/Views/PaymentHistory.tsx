import React from 'react';
import { Typography, Button } from '@easyplanpro/easyplan-components';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { formatInTimeZone } from 'date-fns-tz';
import { useSelector } from 'react-redux';
import { DateLocales } from 'app/utils/constants';
import formattedAmount from 'app/utils/formattedAmount';
import { textForKey } from 'app/utils/localization';
import {
  appLanguageSelector,
  clinicTimeZoneSelector,
} from 'redux/selectors/appDataSelector';
import { paymentsInvoicesSelector } from 'redux/selectors/paymentsSelector';
import styles from './ViewStyles/PaymentHistory.module.scss';

const PaymentHistory = () => {
  const { data, error } = useSelector(paymentsInvoicesSelector);
  const timeZone = useSelector(clinicTimeZoneSelector);
  const appLanguage = useSelector(appLanguageSelector);

  if (error) return <Typography>{textForKey(error)}</Typography>;

  return (
    <div className={styles.wrapper}>
      <TableContainer classes={{ root: styles.container }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight={600}>{textForKey('amount')}</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>
                  {textForKey('currency')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>
                  {textForKey('created at')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>{textForKey('number')}</Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Typography>
                      {formattedAmount(payment.amount, payment.currency)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{payment.currency.toUpperCase()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {formatInTimeZone(
                        payment.created,
                        timeZone,
                        'dd MMMM yyyy',
                        {
                          locale: DateLocales[appLanguage],
                        },
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{payment.number}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      width={'100%'}
                      display={'flex'}
                      justifyContent={'flex-end'}
                      paddingRight={'2.5em'}
                    >
                      <a
                        href={payment.invoicePdf}
                        rel='noreferrer'
                        className={styles.link}
                      >
                        <Button
                          variant='outlined'
                          label={textForKey('call_download')}
                        />
                      </a>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PaymentHistory;
