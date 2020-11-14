import React from 'react';

import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import IconDelete from '../../../assets/icons/iconDelete';
import IconEdit from '../../../assets/icons/iconEdit';
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
          {service.price} MDL
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
            className='services-root__delete-button'
            onClick={handleDeleteService}
          >
            {textForKey('Delete')} <IconDelete />
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
