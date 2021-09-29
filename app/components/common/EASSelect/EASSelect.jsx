import React from "react";
import PropTypes from 'prop-types';
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { textForKey } from "../../../../utils/localization";
import CheckableMenuItem from "../CheckableMenuItem";
import styles from './EASSelect.module.scss';
import InputLabel from "@material-ui/core/InputLabel";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";

const EASSelect = (
  {
    rootClass,
    checkable,
    label,
    labelId,
    multiple,
    options,
    defaultOption,
    value,
    onChange
  }
) => {
  const renderSelectedOptions = (selected) => {
    if (multiple) {
      const filteredOptions = options.filter(item =>
        selected.includes(item.id),
      );
      if (filteredOptions.length === 0) {
        return defaultOption?.name;
      }
      return filteredOptions.map(item => item.name ?? defaultOption?.name).join(', ')
    }
    return options.find(item => item.id === value)?.name ?? defaultOption?.name;
  }

  const isChecked = (option) => {
    if (multiple) {
      return value.includes(option.id);
    }
    return value === option.id;
  }

  const renderMenuItem = (option) => {
    if (option == null) {
      return null;
    }
    if (checkable) {
      return (
        <CheckableMenuItem
          key={option.id}
          value={option.id}
          title={option.name}
          checked={isChecked(option)}
        />
      )
    }
    return (
      <MenuItem
        key={option.id}
        value={option.id}
        className={styles.analyticsMenuItemRoot}
      >
        <ListItemText
          classes={{ primary: styles.analyticsMenuItemText }}
          primary={option.name}
        />
      </MenuItem>
    )
  }

  return (
    <FormControl className={clsx(styles.easSelectRoot, rootClass)}>
      {label && (
        <Typography className={styles.inputLabel} id={labelId}>
          {label}
        </Typography>
      )}
      <Select
        multiple={multiple}
        disableUnderline
        labelId={labelId}
        value={value}
        onChange={onChange}
        classes={{
          root: styles.muiSelectRoot,
          select: styles.muiSelectSelect
        }}
        renderValue={renderSelectedOptions}
      >
        {renderMenuItem(defaultOption)}
        {options.map(renderMenuItem)}
      </Select>
    </FormControl>
  )
};

export default EASSelect;

EASSelect.propTypes = {
  label: PropTypes.string,
  rootClass: PropTypes.any,
  checkable: PropTypes.bool,
  multiple: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
  })),
  defaultOption: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
  }),
  value: PropTypes.any,
  onChange: PropTypes.func,
}
