import React from 'react';

import './styles.scss';
import { Table, TableCell, TableHead, TableRow } from '@material-ui/core';

import { textForKey } from '../../utils/localization';
import SMSMessagesHeader from './comps/SMSMessgesHeader';

const SMSMessages = () => {
  return (
    <div className='sms-messages-root'>
      <SMSMessagesHeader />
      <div className='sms-messages-root__data-wrapper'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{textForKey('Title')}</TableCell>
              <TableCell>{textForKey('Message')}</TableCell>
              <TableCell>{textForKey('Message type')}</TableCell>
              <TableCell>{textForKey('Send time')}</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </div>
    </div>
  );
};

export default SMSMessages;
