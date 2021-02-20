import React, { useEffect, useState } from 'react';

import { remove, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import './UserDetailsModal.module.scss';
import IconClose from '../../assets/icons/iconClose';
import IconSuccess from '../../assets/icons/iconSuccess';
import { triggerUsersUpdate } from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { Action, Role } from '../../utils/constants';
import { fetchClinicData, logUserAction } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import LeftSideModal from '../LeftSideModal';
import LoadingButton from '../LoadingButton';
import CreateHolidayModal from './CreateHolidayModal';
import DoctorForm from './DoctorForm';

const initialData = {
  services: [],
  workdays: [
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
    {
      day: 7,
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
  ],
  holidays: [],
  braces: [],
};

const UserDetailsModal = props => {
  const { onClose, show, user, role } = props;
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(role);
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
    setCurrentTab(role);
    setUserData({ ...userData, userType: role });
  }, [role]);

  useEffect(() => {
    if (user != null) {
      logUserAction(Action.ViewUser, JSON.stringify(user));
      setTimeout(() => {
        fetchUserDetails();
      }, 300);
    }
  }, [user]);

  const fetchUserDetails = async () => {
    const response = await dataAPI.fetchUserDetails(user.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const { data: userDetails } = response;
      setUserData({
        ...initialData,
        services: userDetails.services,
        holidays: userDetails.holidays,
        braces: userDetails.braces,
        workdays:
          userDetails.workdays?.map(item => ({
            ...item,
            selected: !item.isDayOff,
          })) || [],
      });
    }
  };

  const handleModalClose = () => {
    onClose();
    setTimeout(() => handleTabSelect(Role.doctor), 300);
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

  const saveUser = async () => {
    const newServices = userData.services.map(item => {
      if (item.price != null || item.percentage != null) return item;
      return { ...item, price: 0 };
    });

    const newBraces = userData.braces.map(item => {
      if (item.price != null || item.percentage != null) return item;
      return { ...item, price: 0 };
    });

    const requestBody = {
      ...userData,
      services: newServices,
      braces: newBraces,
    };

    if (user != null) {
      await updateUser(requestBody);
    }
  };

  const updateUser = async requestBody => {
    console.log(requestBody);
    const response = await dataAPI.updateUser(user.id, requestBody);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      logUserAction(
        Action.EditUser,
        JSON.stringify({ before: user, after: requestBody }),
      );
      dispatch(triggerUsersUpdate(true));
      dispatch(fetchClinicData());
      handleModalClose();
    }
  };

  const handleSaveForm = async () => {
    setIsSaving(true);
    await saveUser();
    setIsSaving(false);
  };

  const handleCreateHoliday = holiday => {
    setIsCreatingHoliday({ open: true, holiday: holiday });
  };

  const handleHolidayDelete = async holiday => {
    const response = await dataAPI.deleteUserHoliday(user.id, holiday.id);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const newHolidays = cloneDeep(userData.holidays);
      remove(newHolidays, item => item.id === holiday.id);
      setUserData({
        ...userData,
        holidays: newHolidays,
      });
    }
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
        <div className='user-details-root__content'>
          <DoctorForm
            onCreateHoliday={handleCreateHoliday}
            onDeleteHoliday={handleHolidayDelete}
            onChange={handleFormChange}
            data={userData}
            showSteps={user == null}
          />
        </div>
        <div className='user-details-root__footer'>
          <Button className='cancel-button' onClick={handleModalClose}>
            {textForKey('Close')}
            <IconClose />
          </Button>
          <LoadingButton
            onClick={handleSaveForm}
            className='positive-button'
            disabled={isSaving}
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
  role: PropTypes.string,
  show: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    avatar: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    roleInClinic: PropTypes.oneOf([Role.manager, Role.doctor, Role.reception]),
  }),
};
