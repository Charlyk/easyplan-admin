import React from 'react';

import { Button } from 'react-bootstrap';

import IconPlus from '../../../assets/icons/iconPlus';
import { textForKey } from '../../../utils/localization';

const SMSMessagesHeader = props => {
  return (
    <div className='sms-messages-root__header'>
      <Button className='positive-button'>
        {textForKey('Create message')}
        <IconPlus fill='#fff' />
      </Button>
    </div>
  );
};

export default SMSMessagesHeader;
