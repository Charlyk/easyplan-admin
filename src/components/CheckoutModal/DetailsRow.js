import React from 'react';

import { TableCell, TableRow, Typography } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const DetailsRow = ({ title, value, clickableValue, onValueClick }) => {
  const handleValueClick = () => {
    if (!clickableValue) {
      return;
    }
    onValueClick();
  };

  return (
    <TableRow classes={{ root: 'details-table__row' }}>
      <TableCell
        classes={{
          root: clsx('details-table__row__cell', 'title'),
        }}
      >
        <Typography classes={{ root: 'text' }}>{title}</Typography>
      </TableCell>
      <TableCell
        classes={{
          root: clsx('details-table__row__cell', 'value'),
        }}
      >
        <Typography
          onClick={handleValueClick}
          classes={{
            root: clsx('text', {
              'clickable-value': clickableValue,
            }),
          }}
        >
          {value}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default DetailsRow;

DetailsRow.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  clickableValue: PropTypes.bool,
  onValueClick: PropTypes.func,
};

DetailsRow.defaultProps = {
  onValueClick: () => null,
  clickableValue: false,
};
