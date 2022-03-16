import React, { useMemo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import IconRemove from '@material-ui/icons/Clear';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import IconCheckMark from 'app/components/icons/iconCheckMark';
import { textForKey } from 'app/utils/localization';
import styles from './FinalServiceItem.module.scss';

const FinalServiceItem = ({ service, canRemove, onRemove }) => {
  const completedDate = useMemo(() => {
    if (!service.completed) {
      return null;
    }
    return moment(service.completedAt).format('DD.MM.YYYY HH:mm');
  }, [service]);

  const addedDate = useMemo(() => {
    return moment(service.created).format('DD.MM.YYYY HH:MM');
  }, [service]);

  const serviceName = useMemo(() => {
    let name = service.service.name;
    if (service.teeth.length > 0) {
      name = `${name} | Dinții - ${service.teeth.join(', ')}`;
    }
    return name;
  }, [service]);

  return (
    <tr className={styles.finalServiceRoot}>
      <td>
        <div className={styles.serviceWrapper}>
          <Typography classes={{ root: styles.serviceName }}>
            {serviceName}
          </Typography>
          {service.completedBy && (
            <Typography classes={{ root: styles.completedByLabel }}>
              {textForKey(
                'completed by',
                service.completedBy.fullName,
                completedDate,
              )}
            </Typography>
          )}
          {!service.completed && service.addedBy && (
            <Typography classes={{ root: styles.completedByLabel }}>
              {textForKey('added by', service.addedBy.fullName, addedDate)}
            </Typography>
          )}
        </div>
      </td>
      <td width={130} align='right' valign='middle'>
        <IconButton
          disabled={!canRemove}
          onClick={() => onRemove(service)}
          classes={{
            root: clsx(styles.removeBtn, {
              [styles.disabled]: !canRemove && !service.completed,
              [styles.completed]: service.completed,
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
