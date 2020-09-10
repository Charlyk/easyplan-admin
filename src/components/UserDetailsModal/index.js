import React, { useState } from 'react';

import { Tab, Tabs } from 'react-bootstrap';

import LeftSideModal from '../LeftSideModal';
import './styles.scss';
import { Role } from '../../utils/constants';

const UserDetailsModal = props => {
  const [currentTab, setCurrentTab] = useState(Role.admin);
  const handleModalClose = () => {
    console.log('close');
  };

  const handleTabSelect = newKey => {
    setCurrentTab(newKey);
  };

  return (
    <LeftSideModal
      title='Add user'
      steps={['Users', 'Add user']}
      show={true}
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
      </div>
    </LeftSideModal>
  );
};

export default UserDetailsModal;
