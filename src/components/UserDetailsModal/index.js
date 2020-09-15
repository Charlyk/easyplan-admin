import React, { useState } from 'react';

import PropTypes from 'prop-types';
import S3 from 'react-aws-s3';
import { Button, Tab, Tabs } from 'react-bootstrap';

import './styles.scss';
import IconClose from '../../assets/icons/iconClose';
import IconDelete from '../../assets/icons/iconDelete';
import IconSuccess from '../../assets/icons/iconSuccess';
import dataAPI from '../../utils/api/dataAPI';
import { EmailRegex, Role, S3Config } from '../../utils/constants';
import { textForKey } from '../../utils/localization';
import LeftSideModal from '../LeftSideModal';
import LoadingButton from '../LoadingButton';
import AdminForm from './AdminForm';
import DoctorForm from './DoctorForm';
import ReceptionForm from './ReceptionForm';

const UserDetailsModal = props => {
  const { onClose, show } = props;
  const [currentTab, setCurrentTab] = useState(Role.manager);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    userType: currentTab,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatarFile: null,
  });

  const handleModalClose = () => {
    onClose();
  };

  const handleTabSelect = newKey => {
    setCurrentTab(newKey);
    setUserData({
      ...userData,
      userType: newKey,
    });
  };

  const handleFormChange = newData => {
    setUserData({
      ...userData,
      ...newData,
    });
  };

  const isFormValid = () => {
    switch (currentTab) {
      case Role.manager:
      case Role.reception:
      case Role.admin:
        return (
          userData.firstName.replace(' ', '').length > 0 &&
          userData.lastName.replace(' ', '').length > 0 &&
          userData.email.match(EmailRegex)?.length > 0
        );
    }
  };

  const saveUser = avatarUrl => {
    console.log(avatarUrl);
    const requestBody = {
      ...userData,
      avatar: avatarUrl,
    };

    dataAPI
      .createUser(requestBody)
      .then(response => {
        console.log(response);
        setIsSaving(false);
      })
      .catch(error => {
        console.error(error);
        setIsSaving(false);
      });
  };

  const handleSaveForm = () => {
    setIsSaving(true);
    if (userData.avatarFile != null) {
      const s3client = new S3(S3Config('avatars'));
      s3client
        .uploadFile(userData.avatarFile, userData.avatarFile.name)
        .then(result => {
          saveUser(result.location);
        })
        .catch(error => {
          console.error(error);
          saveUser(null);
        });
    } else {
      saveUser(null);
    }
  };

  return (
    <LeftSideModal
      title={textForKey('Add user')}
      steps={[textForKey('Users'), textForKey('Add user')]}
      show={show}
      onClose={handleModalClose}
    >
      <div className='user-details-root'>
        <div className='user-details-root__tabs'>
          <Tabs
            defaultActiveKey={Role.manager}
            activeKey={currentTab}
            onSelect={handleTabSelect}
          >
            <Tab eventKey={Role.manager} title={textForKey('Manager')} />
            <Tab eventKey={Role.reception} title={textForKey('Receptionist')} />
            <Tab eventKey={Role.doctor} title={textForKey('Doctor')} />
          </Tabs>
        </div>
        <div className='user-details-root__content'>
          {currentTab === Role.manager && (
            <AdminForm onChange={handleFormChange} data={userData} />
          )}
          {currentTab === Role.reception && (
            <ReceptionForm onChange={handleFormChange} data={userData} />
          )}
          {currentTab === Role.doctor && <DoctorForm />}
        </div>
        <div className='user-details-root__footer'>
          <Button className='cancel-button' onClick={handleModalClose}>
            {textForKey('Close')}
            <IconClose />
          </Button>
          <LoadingButton className='delete-button'>
            {textForKey('Delete')}
            <IconDelete />
          </LoadingButton>
          <LoadingButton
            onClick={handleSaveForm}
            className='positive-button'
            disabled={!isFormValid()}
            showLoading={isSaving}
          >
            {textForKey('Save')}
            {!isSaving && <IconSuccess />}
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
