import React from 'react';

import { Typography } from '@material-ui/core';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';

import IconArrowNext from '../../../../assets/icons/iconArrowNext';
import IconEdit from '../../../../assets/icons/iconEdit';
import IconPlus from '../../../../assets/icons/iconPlus';
import { textForKey } from '../../../../utils/localization';

const Field = ({ field }) => {
  return (
    <tr className='field'>
      <td style={{ padding: '.3rem' }}>
        <Typography noWrap classes={{ root: 'field-text' }}>
          {textForKey(field.fieldName)}
        </Typography>
      </td>
      {field.startValue && (
        <td style={{ padding: '.3rem' }} align='center'>
          <Typography noWrap classes={{ root: 'field-text' }}>
            {field.startValue}
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
        <Typography noWrap classes={{ root: 'field-text' }}>
          {field.endValue}
        </Typography>
      </td>
    </tr>
  );
};

const HistoryItem = ({ item }) => {
  const itemIcon = () => {
    if (item.action.includes('Create') || item.action.includes('SMS')) {
      return <IconPlus fill='#3A83DC' />;
    } else if (item.action.includes('Update')) {
      return <IconEdit />;
    }
  };
  return (
    <div className='patient-history__item'>
      <div className='history-title-container'>
        <div className='action-icon'>{itemIcon()}</div>
        <Typography classes={{ root: 'history-title-label user' }}>
          {item.user.fullName}
        </Typography>
        <Typography classes={{ root: 'history-title-label' }}>
          {textForKey(`${item.action}action`)}
        </Typography>
      </div>
      <table>
        <tbody>
          {sortBy(item.fields, (it) => it.fieldName).map((field) => (
            <Field key={field.fieldName} field={field} />
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
