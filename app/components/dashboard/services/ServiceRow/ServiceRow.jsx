import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import IconDelete from 'app/components/icons/iconDelete';
import IconEdit from 'app/components/icons/iconEdit';
import IconRefresh from 'app/components/icons/iconRefresh';
import formattedAmount from 'app/utils/formattedAmount';
import { textForKey } from 'app/utils/localization';
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
          <Typography
            classes={{ root: clsx(styles['row-label'], styles['name-label']) }}
          >
            {service.name}
          </Typography>
        </div>
      </td>
      <td align='left' className={styles['description-cell']}>
        <Typography
          classes={{
            root: clsx(styles['row-label'], styles['description-label']),
          }}
        >
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
            variant='outlined'
            classes={{
              root: styles.editBtn,
              outlined: styles.outlinedBtnBlue,
              label: styles.buttonLabel,
            }}
            onPointerUp={handleEditService}
          >
            {textForKey('Edit')} <IconEdit />
          </Button>
          <Button
            variant='outlined'
            disabled={service.bracket}
            classes={{
              root: clsx({
                [styles.deleteBtn]: !service.deleted,
                [styles.restoreBtn]: service.deleted,
              }),
              outlined: clsx({
                [styles.outlinedBtnRed]: !service.deleted,
                [styles.outlinedBtnGreen]: service.deleted,
              }),
              label: styles.buttonLabel,
            }}
            onPointerUp={handleDeleteService}
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
