import React, { useEffect, useState } from 'react';

import { remove, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import S3 from 'react-aws-s3';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import './styles.scss';
import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import { triggerUsersUpdate } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { EmailRegex, Role, S3Config } from '../../utils/constants';
import { uploadFileToAWS } from '../../utils/helperFuncs';
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
      day: 0,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      day: 1,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      day: 2,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      day: 3,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      day: 4,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      day: 5,
      startHour: null,
      endHour: null,
      selected: false,
    },
    {
      day: 6,
      startHour: null,
      endHour: null,
      selected: false,
    },
  ],
  holidays: [],
};

const UserDetailsModal = props => {
  const { onClose, show, user } = props;
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(Role.manager);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    ...initialData,
    userType: currentTab,
  });
  const [isCreatingHoliday, setIsCreatingHoliday] = useState({
    open: false,
    holiday: null,
  });

  useEffect(() => {
    if (user != null) {
      setCurrentTab(user.role);
      setUserData({
        ...initialData,
        ...user,
        userType: user.role,
        workDays: user.workDays.map(item => ({
          ...item,
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
        setIsSaving(false);
        if (!response.isError) {
          dispatch(triggerUsersUpdate());
          handleModalClose();
        } else {
          console.error(response);
        }
      })
      .catch(error => {
        console.error(error);
        setIsSaving(false);
      });
  };

  const createUser = requestBody => {
    dataAPI
      .createUser(requestBody)
      .then(() => {
        dispatch(triggerUsersUpdate());
        setIsSaving(false);
        handleModalClose();
      })
      .catch(error => {
        console.error(error);
        setIsSaving(false);
      });
  };

  const handleSaveForm = async () => {
    setIsSaving(true);
    if (userData.avatarFile != null) {
      const result = await uploadFileToAWS('avatars', userData.avatarFile);
      saveUser(result?.location);
    } else {
      saveUser(null);
    }
  };

  const handleCreateHoliday = holiday => {
    setIsCreatingHoliday({ open: true, holiday: holiday });
  };

  const handleHolidayDelete = holiday => {
    const newHolidays = cloneDeep(userData.holidays);
    remove(newHolidays, item => item.id === holiday.id);
    setUserData({
      ...userData,
      holidays: newHolidays,
    });
  };

  const handleSaveHoliday = holiday => {
    let newHolidays = cloneDeep(userData.holidays);
    if (newHolidays.some(item => item.id === holiday.id)) {
      // holiday already in the list so we need just to update it
      newHolidays = newHolidays.map(item => {
        if (item.id !== holiday.id) return item;
        return {
          ...item,
          ...holiday,
        };
      });
    } else {
      // it's a new holiday so we need to add it to the list
      newHolidays.push({
        ...holiday,
        id: uuidv4(),
      });
    }

    setUserData({
      ...userData,
      holidays: newHolidays,
    });
    setIsCreatingHoliday({ open: false, holiday: null });
  };

  const handleCloseHolidayModal = () => {
    setIsCreatingHoliday({ open: false, holiday: null });
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
        show={isCreatingHoliday.open}
        holiday={isCreatingHoliday.holiday}
        onCreate={handleSaveHoliday}
        onClose={handleCloseHolidayModal}
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
              onCreateHoliday={handleCreateHoliday}
              onDeleteHoliday={handleHolidayDelete}
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
            disabled={!isFormValid() || isSaving}
            isLoading={isSaving}
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
    holidays: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    services: PropTypes.arrayOf(
      PropTypes.shape({
        serviceId: PropTypes.string,
        price: PropTypes.number,
        percentage: PropTypes.number,
      }),
    ),
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
