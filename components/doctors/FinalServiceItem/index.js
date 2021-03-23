import React from 'react';

import { IconButton, Typography } from '@material-ui/core';
import IconRemove from '@material-ui/icons/Clear';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconCheckMark from '../../icons/iconCheckMark';
import { getServiceName } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/FinalServiceItem.module.scss';

const FinalServiceItem = ({ service, canRemove, onRemove }) => {
  return (
    <tr className={styles['final-service-root']}>
      <td>
        <div className={styles['service-wrapper']}>
          <Typography classes={{ root: styles['service-name'] }}>
            {getServiceName(service)}
          </Typography>
          {service.completedBy && (
            <Typography classes={{ root: styles['completed-by-label'] }}>
              {textForKey('completed by')} {service.completedBy}
            </Typography>
          )}
          {!service.completed && service.addedByName && (
            <Typography classes={{ root: styles['completed-by-label'] }}>
              {textForKey('added by')} {service.addedByName}
            </Typography>
          )}
        </div>
      </td>
      <td width={130} align='right' valign='middle'>
        <IconButton
          disabled={!canRemove}
          onClick={() => onRemove(service)}
          classes={{
            root: clsx(styles['remove-btn'], {
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
