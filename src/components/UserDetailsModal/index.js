import React, { useEffect, useState } from 'react';

import { remove, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import S3 from 'react-aws-s3';
import { Button, Tab, Tabs } from 'react-bootstrap';

import './styles.scss';
import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import dataAPI from '../../utils/api/dataAPI';
import { EmailRegex, Role, S3Config } from '../../utils/constants';
import { textForKey } from '../../utils/localization';
import LeftSideModal from '../LeftSideModal';
import LoadingButton from '../LoadingButton';
import AdminForm from './AdminForm';
import CreateHolidayModal from './CreateHolidayModal';
import DoctorForm from './DoctorForm';
import ReceptionForm from './ReceptionForm';

const initialData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  avatarFile: null,
  services: [],
  workDays: [
    {
      dayId: 0,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      dayId: 1,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      dayId: 2,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      dayId: 3,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      dayId: 4,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      dayId: 5,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      dayId: 6,
      startHour: null,
      endHour: null,
      selected: false,
    },
  ],
};

const UserDetailsModal = props => {
  const { onClose, show, user } = props;
  const [currentTab, setCurrentTab] = useState(Role.manager);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    ...initialData,
    userType: currentTab,
  });

  useEffect(() => {
    if (user != null) {
      console.log(user);
      setCurrentTab(user.role);
      setUserData({
        ...initialData,
        ...user,
        userType: user.role,
        workDays: user.workDays.map(item => ({
          dayId: item.day,
          startHour: item.startHour,
          endHour: item.endHour,
          selected: !item.isDayOff,
        })),
      });
    }
  }, [user]);

  const handleModalClose = () => {
    onClose();
    setTimeout(() => handleTabSelect(Role.manager), 300);
  };

  const handleTabSelect = newKey => {
    setCurrentTab(newKey);
    setUserData({
      ...initialData,
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
      case Role.doctor:
      case Role.admin:
        return (
          userData.firstName.replace(' ', '').length > 0 &&
          userData.lastName.replace(' ', '').length > 0 &&
          userData.email.match(EmailRegex)?.length > 0
        );
      default:
        return false;
    }
  };

  const saveUser = avatarUrl => {
    // clear services with no price and percentage
    const newServices = cloneDeep(userData.services);
    remove(newServices, item => item.price == null && item.percentage == null);

    const requestBody = {
      ...userData,
      avatar: avatarUrl,
      services: newServices,
    };

    if (user == null) {
      createUser(requestBody);
    } else {
      updateUser(requestBody);
    }
  };

  const updateUser = requestBody => {
    dataAPI
      .updateUser(user.id, requestBody)
      .then(response => {
        console.log(response);
        setIsSaving(false);
      })
      .catch(error => {
        console.error(error);
        setIsSaving(false);
      });
  };

  const createUser = requestBody => {
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

  const steps = [textForKey('Users')];
  if (user != null) {
    steps.push(textForKey(`${user.firstName} ${user.lastName}`));
    steps.push(textForKey('Edit user'));
  } else {
    steps.push(textForKey('Add user'));
  }

  return (
    <LeftSideModal
      title={user ? textForKey('Edit user') : textForKey('Add user')}
      steps={steps}
      show={show}
      onClose={handleModalClose}
    >
      <CreateHolidayModal
        show={true}
        onCreate={() => null}
        onClose={() => null}
      />
      <div className='user-details-root'>
        {user == null && (
          <div className='user-details-root__tabs'>
            <Tabs
              defaultActiveKey={Role.manager}
              activeKey={currentTab}
              onSelect={handleTabSelect}
            >
              <Tab eventKey={Role.manager} title={textForKey('Manager')} />
              <Tab
                eventKey={Role.reception}
                title={textForKey('Receptionist')}
              />
              <Tab eventKey={Role.doctor} title={textForKey('Doctor')} />
            </Tabs>
          </div>
        )}
        <div className='user-details-root__content'>
          {currentTab === Role.manager && (
            <AdminForm onChange={handleFormChange} data={userData} />
          )}
          {currentTab === Role.reception && (
            <ReceptionForm onChange={handleFormChange} data={userData} />
          )}
          {currentTab === Role.doctor && (
            <DoctorForm
              onChange={handleFormChange}
              data={userData}
              showSteps={user == null}
            />
          )}
        </div>
        <div className='user-details-root__footer'>
          <Button className='cancel-button' onClick={handleModalClose}>
            {textForKey('Close')}
            <IconClose />
          </Button>
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
  user: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.oneOf([Role.manager, Role.doctor, Role.reception]),
    status: PropTypes.string,
    workDays: PropTypes.arrayOf(
      PropTypes.shape({
        day: PropTypes.number,
        endHour: PropTypes.string,
        startHour: PropTypes.string,
        isDayOff: PropTypes.bool,
      }),
    ),
  }),
};
