import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Button, Tab, Tabs } from 'react-bootstrap';

import './styles.scss';
import IconClose from '../../assets/icons/iconClose';
import IconDelete from '../../assets/icons/iconDelete';
import IconSuccess from '../../assets/icons/iconSuccess';
import { Role } from '../../utils/constants';
import { textForKey } from '../../utils/localization';
import LeftSideModal from '../LeftSideModal';
import LoadingButton from '../LoadingButton';
import AdminForm from './AdminForm';
import DoctorForm from './DoctorForm';
import ReceptionForm from './ReceptionForm';

const UserDetailsModal = props => {
  const { onClose, show } = props;
  const [currentTab, setCurrentTab] = useState(Role.admin);
  const handleModalClose = () => {
    onClose();
  };

  const handleTabSelect = newKey => {
    setCurrentTab(newKey);
  };

  return (
    <LeftSideModal
      title='Add user'
      steps={['Users', 'Add user']}
      show={show}
      onClose={handleModalClose}
    >
      <div className='user-details-root'>
        <div className='user-details-root__tabs'>
          <Tabs
            defaultActiveKey={Role.admin}
            activeKey={currentTab}
            onSelect={handleTabSelect}
          >
            <Tab eventKey={Role.admin} title='Administrator' />
            <Tab eventKey={Role.reception} title='Receptionist' />
            <Tab eventKey={Role.doctor} title='Doctor' />
          </Tabs>
        </div>
        <div className='user-details-root__content'>
          {currentTab === Role.admin && <AdminForm />}
          {currentTab === Role.reception && <ReceptionForm />}
          {currentTab === Role.doctor && <DoctorForm />}
        </div>
        <div className='user-details-root__footer'>
          <Button className='cancel-button' onClick={handleModalClose}>
            {textForKey('Cancel')}
            <IconClose />
          </Button>
          <LoadingButton className='delete-button'>
            {textForKey('Delete')}
            <IconDelete />
          </LoadingButton>
          <LoadingButton className='positive-button'>
            {textForKey('Save')}
            <IconSuccess />
          </LoadingButton>
        </div>
      </div>
    </LeftSideModal>
  );
};

export default UserDetailsModal;

UserDetailsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};
