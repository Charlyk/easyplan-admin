import React from 'react';

import { IconButton, Typography } from '@material-ui/core';
import IconRemove from '@material-ui/icons/Clear';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconCheckMark from '../../../assets/icons/iconCheckMark';
import { getServiceName } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';

const FinalServiceItem = ({ service, canRemove, onRemove }) => {
  return (
    <tr className='final-service-root'>
      <td>
        <Typography classes={{ root: 'service-name' }}>
          {getServiceName(service)}
          {service.completedBy && (
            <Typography classes={{ root: 'completed-by-label' }}>
              {textForKey('completed by')} {service.completedBy}
            </Typography>
          )}
        </Typography>
      </td>
      <td width={130} align='right' valign='middle'>
        <IconButton
          disabled={!canRemove}
          onClick={() => onRemove(service)}
          classes={{
            root: clsx('remove-btn', {
              disabled: !canRemove && !service.completed,
              completed: service.completed,
            }),
          }}
        >
          {service.completed ? <IconCheckMark /> : <IconRemove />}
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
