import React from 'react';

import { Typography } from '@material-ui/core';
import sortBy from 'lodash/sortBy';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import clsx from "clsx";

import IconArrowNext from '../../../../../../../components/icons/iconArrowNext';
import IconEdit from '../../../../../../../components/icons/iconEdit';
import IconPlus from '../../../../../../../components/icons/iconPlus';
import { clinicTimeZoneSelector } from '../../../../../../../redux/selectors/clinicSelector';
import { textForKey } from '../../../../../../../utils/localization';
import styles from './HistoryItem.module.scss'
import IconDelete from "../../../../../../../components/icons/iconDelete";

const Field = ({ field, clinic }) => {
  const timeZone = clinicTimeZoneSelector(clinic);

  const isDate = (value) => {
    const regex = /\d{4}-\d{2}-\d{2}(\s|T)\d{2}:\d{2}:\d{2}.\d{3}/;
    return value?.match(regex);
  };

  const getValue = (value) => {
    if (isDate(value)) {
      return moment(value).tz(timeZone).format('DD.MM.YYYY HH:mm');
    }
    return value;
  };

  return (
    <tr className={styles.field}>
      <td style={{ padding: '.3rem' }}>
        <Typography noWrap classes={{ root: styles['field-text'] }}>
          {textForKey(field.fieldName)}
        </Typography>
      </td>
      {field.startValue && (
        <td style={{ padding: '.3rem' }} align='center'>
          <Typography classes={{ root: styles['field-text'] }}>
            {textForKey(getValue(field.startValue))}
          </Typography>
        </td>
      )}
      {field.startValue && (
        <td align='center'>
          <IconArrowNext />
        </td>
      )}
      <td
        colSpan={field.startValue ? 1 : 3}
        style={{ padding: '.3rem' }}
        align='center'
      >
        <Typography classes={{ root: styles['field-text'] }}>
          {textForKey(getValue(field.endValue))}
        </Typography>
      </td>
    </tr>
  );
};

const HistoryItem = ({ item, clinic }) => {
  const itemIcon = () => {
    if (item.action.includes('Create') || item.action.includes('SMS')) {
      return <IconPlus fill='#3A83DC' />;
    } else if (item.action.includes('Update')) {
      return <IconEdit />;
    } else if (item.action.includes('Delete')) {
      return <IconDelete />;
    }
  };

  return (
    <div className={styles.historyItem}>
      <div className={styles['history-title-container']}>
        <div className={styles['action-icon']}>{itemIcon()}</div>
        <Typography classes={{ root: clsx(styles['history-title-label'], styles.user) }}>
          {item.user.fullName}
        </Typography>
        <Typography classes={{ root: styles['history-title-label'] }}>
          {textForKey(`${item.action}action`)}{' '}
          {moment(item.created).format('DD.MM.YYYY HH:mm')} ({item.targetId})
        </Typography>
      </div>
      <table>
        <tbody>
        {sortBy(item.fields, (it) => it.fieldName).map((field) => (
          <Field key={field.fieldName} clinic={clinic} field={field} />
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryItem;

HistoryItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    targetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    created: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    action: PropTypes.string,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        fieldName: PropTypes.string,
        startValue: PropTypes.string,
        endValue: PropTypes.string,
      }),
    ),
  }),
};

Field.propTypes = {
  field: PropTypes.shape({
    fieldName: PropTypes.string,
    startValue: PropTypes.string,
    endValue: PropTypes.string,
  }),
};
