import React from 'react';

import { IconButton } from '@material-ui/core';
import IconRemove from '@material-ui/icons/Clear';
import PropTypes from 'prop-types';

import { getServiceName } from '../../../utils/helperFuncs';

const FinalServiceItem = ({ service, onRemove }) => {
  return (
    <tr className='final-service-root'>
      <td>
        <span className='service-name'>{getServiceName(service)}</span>
      </td>
      <td width={130} align='right' valign='middle'>
        <span className='service-price'>{service.price} MDL</span>
        <IconButton
          onClick={() => onRemove(service)}
          classes={{ root: 'remove-btn' }}
        >
          <IconRemove />
        </IconButton>
      </td>
    </tr>
  );
};

export default FinalServiceItem;

FinalServiceItem.propTypes = {
  service: PropTypes.object,
  onRemove: PropTypes.func,
};

FinalServiceItem.defaultProps = {
  onRemove: () => null,
};
