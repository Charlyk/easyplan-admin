import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useTranslate } from 'react-polyglot';
import styles from './PatientPurchasesList.module.scss';

interface Props {
  totalCost: number | string;
  totalDebts: number | string;
  totalPrepayment: number | string;
}

const PatientPurchaseListFooter: React.FC<Props> = ({
  totalCost,
  totalPrepayment,
  totalDebts,
}) => {
  const textForKey = useTranslate();

  return (
    <>
      <TableRow>
        <TableCell
          align='right'
          colSpan={8}
          style={{ borderBottom: 'none', paddingBottom: 0 }}
        >
          <div
            className='flexContainer'
            style={{ width: '100%', justifyContent: 'flex-end' }}
          >
            <Typography classes={{ root: styles.totalsText }}>
              {textForKey('total-prepayment')}:
            </Typography>
            <Typography
              classes={{
                root: clsx('totals-text', styles.totalsAmount),
              }}
            >
              {totalPrepayment}
            </Typography>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          align='right'
          colSpan={8}
          style={{ borderBottom: 'none', paddingBottom: 0 }}
        >
          <div
            className='flexContainer'
            style={{ width: '100%', justifyContent: 'flex-end' }}
          >
            <Typography classes={{ root: styles.totalsText }}>
              {textForKey('total-debt')}:
            </Typography>
            <Typography
              classes={{
                root: clsx('totals-text', styles.totalsAmount),
              }}
            >
              {totalDebts}
            </Typography>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align='right' colSpan={8} style={{ borderBottom: 'none' }}>
          <div
            className='flexContainer'
            style={{ width: '100%', justifyContent: 'flex-end' }}
          >
            <Typography classes={{ root: styles.totalsText }}>
              {textForKey('total-cost')}:
            </Typography>
            <Typography
              classes={{
                root: clsx('totals-text', styles.totalsAmount),
              }}
            >
              {totalCost}
            </Typography>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default PatientPurchaseListFooter;
