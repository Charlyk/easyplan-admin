import React, { useRef, useState } from 'react';

import {
  Menu,
  MenuItem,
  ClickAwayListener,
  Typography,
} from '@material-ui/core';
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import IconClock from '../../../../../assets/icons/iconClock';
import { clinicServicesSelector } from '../../../../../redux/selectors/clinicSelector';
import { textForKey } from '../../../../../utils/localization';

const DoctorItem = ({ doctor, onAddPause }) => {
  const doctorAnchor = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const clinicServices = useSelector(clinicServicesSelector);

  const doctorServices = () => {
    const servicesIds = doctor.services.map(it => it.serviceId);
    return clinicServices
      .filter(item => servicesIds.includes(item.id))
      .map(it => it.name);
  };

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAddPause = () => {
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
      <MenuItem onClick={handleAddPause} classes={{ root: 'menu-option' }}>
        <IconClock />
        <Typography classes={{ root: 'option-label' }}>
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
      className='day-doctors-container__item'
      id={doctor.id}
    >
      {optionsMenu}
      <ClickAwayListener onClickAway={handleCloseMenu}>
        <Typography noWrap classes={{ root: 'doctor-name' }}>
          {upperFirst(doctor.firstName.toLowerCase())}{' '}
          {upperFirst(doctor.lastName.toLowerCase())}
        </Typography>
      </ClickAwayListener>
    </div>
  );
};

export default DoctorItem;

DoctorItem.propTypes = {
  doctor: PropTypes.object,
  onAddPause: PropTypes.func,
};

DoctorItem.defaultProps = {
  onAddPause: () => null,
};
