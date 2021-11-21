import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import CheckableMenuItem from '../CheckableMenuItem';
import styles from './EASSelect.module.scss';

const EASSelect = ({
  updateText,
  selectClass,
  rootClass,
  disabled,
  checkable,
  label,
  labelId,
  multiple,
  options,
  defaultOption,
  value,
  variant,
  onChange,
}) => {
  const updated = (value) => {
    if (!updateText) {
      return value;
    }
    return upperFirst(value?.toLowerCase());
  };

  const renderSelectedOptions = (selected) => {
    if (multiple) {
      const filteredOptions = options.filter((item) =>
        selected.includes(item.id),
      );
      if (filteredOptions.length === 0) {
        return updated(defaultOption?.name);
      }
      return filteredOptions
        .map((item) => updated(item.name ?? defaultOption?.name))
        .join(', ');
    }
    return updated(
      options.find((item) => item.id === value)?.name ?? defaultOption?.name,
    );
  };

  const isChecked = (option) => {
    if (multiple) {
      return value.includes(option.id);
    }
    return value === option.id;
  };

  const renderMenuItem = (option) => {
    if (option == null) {
      return null;
    }
    if (checkable) {
      return (
        <CheckableMenuItem
          key={option.id}
          value={option.id}
          title={updated(option.name)}
          checked={isChecked(option)}
        />
      );
    }
    return (
      <MenuItem
        key={option.id}
        value={option.id}
        className={styles.analyticsMenuItemRoot}
      >
        <ListItemText
          classes={{ primary: styles.analyticsMenuItemText }}
          primary={updated(option.name)}
        />
      </MenuItem>
    );
  };

  return (
    <FormControl className={clsx(styles.easSelectRoot, rootClass)}>
      {label && (
        <Typography className={styles.inputLabel} id={labelId}>
          {label}
        </Typography>
      )}
      <Select
        disabled={disabled}
        multiple={multiple}
        disableUnderline
        labelId={labelId}
        value={value}
        onChange={onChange}
        classes={{
          root: clsx(styles.muiSelectRoot, selectClass),
          select: clsx(styles.muiSelectSelect, styles[variant]),
        }}
        renderValue={renderSelectedOptions}
      >
        {renderMenuItem(defaultOption)}
        {options.map(renderMenuItem)}
      </Select>
    </FormControl>
  );
};

export default EASSelect;

EASSelect.propTypes = {
  variant: PropTypes.oneOf(['outlined', 'text']),
  label: PropTypes.string,
  rootClass: PropTypes.any,
  checkable: PropTypes.bool,
  multiple: PropTypes.bool,
  updateText: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any,
      name: PropTypes.string,
    }),
  ),
  defaultOption: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
  }),
  value: PropTypes.any,
  onChange: PropTypes.func,
};
