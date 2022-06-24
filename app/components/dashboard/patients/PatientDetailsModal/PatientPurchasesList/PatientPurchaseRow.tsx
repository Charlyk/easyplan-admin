import React, { useState, useMemo } from 'react';
import { Tooltip } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { formatInTimeZone } from 'date-fns-tz';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import IconMinus from 'app/components/icons/iconMinus';
import IconPlus from 'app/components/icons/iconPlus';
import IconPrint from 'app/components/icons/iconPrint';
import IconTrash from 'app/components/icons/iconTrash';
import { DateLocales } from 'app/utils/constants';
import formattedAmount from 'app/utils/formattedAmount';
import { baseApiUrl } from 'eas.config';
import { setPaymentModal } from 'redux/actions/actions';
import {
  appLanguageSelector,
  clinicTimeZoneSelector,
  isManagerSelector,
} from 'redux/selectors/appDataSelector';
import { PatientPurchaseDiscounted } from 'types';
import styles from './PatientPurchasesList.module.scss';

interface Props {
  payment: PatientPurchaseDiscounted;
  handleUndoPayment(payment: PatientPurchaseDiscounted): void;
}

const PatientPurchaseRow: React.FC<Props> = ({
  payment,
  handleUndoPayment,
}) => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const appLanguage = useSelector(appLanguageSelector);
  const timeZone = useSelector(clinicTimeZoneSelector);
  const isManager = useSelector(isManagerSelector);

  const hasDebts = useMemo(() => {
    return payment.paid < payment.total;
  }, []);

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getAmount = (
    payment: { total?: number; paid?: number; currency: string },
    mode: 'total' | 'paid' = 'total',
  ) => {
    return formattedAmount(payment[mode], payment.currency);
  };

  const handlePayDebt = () => {
    dispatch(
      setPaymentModal({
        open: true,
        invoice: payment,
        schedule: null,
        isNew: false,
      }),
    );
  };

  return (
    <>
      <TableRow key={payment.id}>
        <TableCell>
          <IconButton
            onClick={toggleExpanded}
            classes={{ root: styles.expandButton }}
          >
            {expanded ? (
              <IconMinus fill={'#3A83DC'} />
            ) : (
              <IconPlus fill={'#3A83DC'} />
            )}
          </IconButton>
        </TableCell>
        <TableCell>
          {formatInTimeZone(payment.created, timeZone, 'dd-MM-yyyy HH:mm', {
            locale: DateLocales[appLanguage],
          })}
        </TableCell>
        <TableCell>{payment.services.join(', ')}</TableCell>
        <TableCell>{payment.discount}%</TableCell>
        <TableCell>{getAmount(payment, 'paid')}</TableCell>
        <TableCell>
          {formattedAmount(payment.discountedTotal, payment.currency)}
        </TableCell>
        <TableCell classes={{ root: 'amount-cell' }}>
          {getAmount(payment)}
        </TableCell>
        <TableCell>
          {isManager && (
            //eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            <Box display={'flex'} alignItems={'center'}>
              <Tooltip title={textForKey('print receipt')}>
                <a
                  href={`${baseApiUrl}/invoices/receipt/${payment.id}?mode=invoice`}
                  target='_blank'
                  rel='noreferrer'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '.5em',
                  }}
                >
                  <IconPrint fill='#3A83DC' />
                </a>
              </Tooltip>
              <Tooltip title={textForKey('undo_payment')}>
                <IconButton onClick={() => handleUndoPayment(payment)}>
                  <IconTrash fill={'#ec3276'} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} style={{ padding: 0, borderBottom: 'none' }}>
          <Collapse in={expanded} unmountOnExit>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>{textForKey('user')}</TableCell>
                  <TableCell>{textForKey('date')}</TableCell>
                  <TableCell>{textForKey('amount')}</TableCell>
                  <TableCell>{textForKey('comment')}</TableCell>
                  <TableCell>{textForKey('user-comment')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payment.payments.map((itemPayment) => (
                  <TableRow
                    key={itemPayment.id}
                    style={{ borderBottom: 'none' }}
                  >
                    <TableCell />
                    <TableCell>{itemPayment.userName}</TableCell>
                    <TableCell>
                      {formatInTimeZone(
                        itemPayment.created,
                        timeZone,
                        'dd.MM.yyyy HH:mm',
                        {
                          locale: DateLocales[appLanguage],
                        },
                      )}
                    </TableCell>
                    <TableCell>{itemPayment.amount}</TableCell>
                    <TableCell>{itemPayment.comment || '-'}</TableCell>
                    <TableCell>{itemPayment.userComment ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default PatientPurchaseRow;
