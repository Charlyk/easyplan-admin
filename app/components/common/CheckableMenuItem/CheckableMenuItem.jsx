import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './CheckableMenuItem.module.scss';

const CheckableMenuItem = React.forwardRef(
  ({ title, value, checked, ...rest }, ref) => {
    return (
      <MenuItem
        {...rest}
        ref={ref}
        value={value}
        className={styles.analyticsMenuItemRoot}
      >
        <Checkbox
          classes={{
            root: styles.analyticsMenuItemCheckbox,
            checked: styles.analyticsMenuItemCheckboxChecked,
          }}
          checked={checked}
        />
        <ListItemText
          classes={{ primary: styles.analyticsMenuItemText }}
          primary={title}
        />
      </MenuItem>
    );
  },
);

CheckableMenuItem.displayName = 'CheckableMenuItem';

export default CheckableMenuItem;
