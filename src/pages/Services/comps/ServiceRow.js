import React from 'react';

import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import IconDelete from '../../../assets/icons/iconDelete';
import IconEdit from '../../../assets/icons/iconEdit';
import IconRefresh from '../../../assets/icons/iconRefresh';
import { formattedAmount } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';

const ServiceRow = ({ service, onEditService, onDeleteService }) => {
  const handleEditService = () => {
    onEditService(service);
  };

  const handleDeleteService = () => {
    onDeleteService(service);
  };

  return (
    <tr key={service.id}>
      <td>
        <div className='name-and-color'>
          <div
            className='color-indicator'
            style={{ backgroundColor: service.color }}
          />
          <Typography classes={{ root: 'row-label name-label' }}>
            {service.name}
          </Typography>
        </div>
      </td>
      <td align='left' className='description-cell'>
        <Typography classes={{ root: 'row-label description-label' }}>
          {service.description || '-'}
        </Typography>
      </td>
      <td align='right'>
        <Typography noWrap classes={{ root: 'row-label' }}>
          {service.duration} min
        </Typography>
      </td>
      <td align='right'>
        <Typography noWrap classes={{ root: 'row-label' }}>
          {formattedAmount(service.price, service.currency)}
        </Typography>
      </td>
      <td align='right'>
        <div className='actions-wrapper'>
          <Button
            className='services-root__edit-button'
            onClick={handleEditService}
          >
            {textForKey('Edit')} <IconEdit />
          </Button>
          <Button
            disabled={service.bracket}
            className={clsx(
              'services-root__delete-button',
              service.deleted && 'positive',
            )}
            onClick={handleDeleteService}
          >
            {service.deleted ? textForKey('Restore') : textForKey('Delete')}{' '}
            {service.deleted ? <IconRefresh fill='#00E987' /> : <IconDelete />}
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ServiceRow;

ServiceRow.propTypes = {
  service: PropTypes.object,
  onEditService: PropTypes.func,
  onDeleteService: PropTypes.func,
};

ServiceRow.defaultProps = {
  onEditService: () => null,
  onDeleteService: () => null,
};
