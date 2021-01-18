import React from 'react';

import { IconButton } from '@material-ui/core';
import IconRemove from '@material-ui/icons/Clear';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { getServiceName } from '../../../utils/helperFuncs';

const FinalServiceItem = ({ service, canRemove, onRemove }) => {
  return (
    <tr className='final-service-root'>
      <td>
        <span className='service-name'>{getServiceName(service)}</span>
      </td>
      <td width={130} align='right' valign='middle'>
        <span className='service-price'>{service.price} MDL</span>
        <IconButton
          disabled={!canRemove}
          onClick={() => onRemove(service)}
          classes={{ root: clsx('remove-btn', !canRemove && 'disabled') }}
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
  canRemove: PropTypes.bool,
  onRemove: PropTypes.func,
};

FinalServiceItem.defaultProps = {
  onRemove: () => null,
  canRemove: true,
};
