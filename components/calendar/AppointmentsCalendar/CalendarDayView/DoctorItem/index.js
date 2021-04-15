import React, { useRef, useState } from 'react';

import {
  Menu,
  MenuItem,
  ClickAwayListener,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';

import IconClock from '../../../../icons/iconClock';
import { textForKey } from '../../../../../utils/localization';
import styles from '../../../../../styles/DoctorItem.module.scss';

const DoctorItem = ({ doctor, itemId, isInVacation, name, onAddPause }) => {
  const doctorAnchor = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenMenu = () => {
    if (doctor.isInVacation) return;
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAddPause = () => {
    if (typeof onAddPause !== 'function') {
      return;
    }
    onAddPause(doctor);
    handleCloseMenu();
  };

  const optionsMenu = (
    <Menu
      disablePortal
      id='simple-menu'
      anchorEl={doctorAnchor.current}
      keepMounted
      open={isMenuOpen}
      onClose={handleCloseMenu}
    >
      <MenuItem onClick={handleAddPause} classes={{ root: styles['menu-option'] }}>
        <IconClock/>
        <Typography classes={{ root: styles['option-label'] }}>
          {textForKey('Add pause')}
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <div
      ref={doctorAnchor}
      role='button'
      tabIndex={0}
      onClick={handleOpenMenu}
      className={
        clsx(styles.doctorItem, {
          [isInVacation]: styles.disabled
        })
      }
      id={itemId}
    >
      {typeof onAddPause === 'function' && optionsMenu}
      <ClickAwayListener onClickAway={handleCloseMenu}>
        <Typography noWrap classes={{ root: styles['doctor-name'] }}>
          {upperFirst(name.toLowerCase())}
        </Typography>
      </ClickAwayListener>
    </div>
  );
};

export default DoctorItem;

DoctorItem.propTypes = {
  itemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isInVacation: PropTypes.bool,
  name: PropTypes.string,
  doctor: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    isInVacation: PropTypes.bool,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        serviceId: PropTypes.number,
      }),
    ),
  }),
  onAddPause: PropTypes.func,
};
