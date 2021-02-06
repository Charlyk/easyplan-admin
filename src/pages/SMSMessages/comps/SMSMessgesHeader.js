import React from 'react';

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import IconPlus from '../../../assets/icons/iconPlus';
import { textForKey } from '../../../utils/localization';

const SMSMessagesHeader = ({ onCreate }) => {
  return (
    <div className='sms-messages-root__header'>
      <Button className='positive-button' onClick={onCreate}>
        {textForKey('Create message')}
        <IconPlus fill='#fff' />
      </Button>
    </div>
  );
};

export default SMSMessagesHeader;

SMSMessagesHeader.propTypes = {
  onCreate: PropTypes.func,
};
