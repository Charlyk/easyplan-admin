import React from 'react';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import IconDelete from '../../../../../components/icons/iconDelete';
import IconEdit from '../../../../../components/icons/iconEdit';
import IconRefresh from '../../../../../components/icons/iconRefresh';
import { formattedAmount } from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';
import styles from './ServiceRow.module.scss';

const ServiceRow = ({ service, onEditService, onDeleteService }) => {
  const handleEditService = () => {
    onEditService(service);
  };

  const handleDeleteService = () => {
    onDeleteService(service);
  };

  return (
    <tr key={service.id} className={styles.serviceRow}>
      <td>
        <div className={styles['name-and-color']}>
          <div
            className={styles['color-indicator']}
            style={{ backgroundColor: service.color }}
          />
          <Typography classes={{ root: clsx(styles['row-label'], styles['name-label']) }}>
            {service.name}
          </Typography>
        </div>
      </td>
      <td align='left' className={styles['description-cell']}>
        <Typography classes={{ root: clsx(styles['row-label'], styles['description-label']) }}>
          {service.description || '-'}
        </Typography>
      </td>
      <td align='right'>
        <Typography noWrap classes={{ root: styles['row-label'] }}>
          {service.duration} min
        </Typography>
      </td>
      <td align='right'>
        <Typography noWrap classes={{ root: styles['row-label'] }}>
          {formattedAmount(service.price, service.currency)}
        </Typography>
      </td>
      <td align='right'>
        <div className={styles['actions-wrapper']}>
          <Button
            className={styles['edit-button']}
            onClick={handleEditService}
          >
            {textForKey('Edit')} <IconEdit />
          </Button>
          <Button
            disabled={service.bracket}
            className={clsx(
              styles['delete-button'],
              service.deleted && styles.positive,
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
