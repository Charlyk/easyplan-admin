import React, { useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { remove, cloneDeep, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';
import CircularProgress from "@material-ui/core/CircularProgress";

import IconClose from '../../../icons/iconClose';
import IconSuccess from '../../../icons/iconSuccess';
import { Role } from '../../../../utils/constants';
import { textForKey } from '../../../../../utils/localization';
import LeftSideModal from '../../../common/LeftSideModal';
import LoadingButton from '../../../common/LoadingButton';
import {
  deleteUserHoliday,
  getUserDetails,
  updateUserDetails
} from "../../../../../middleware/api/users";
import DoctorForm from './DoctorForm';
import reducer, {
  initialData,
  initialState,
  setIsCreatingHoliday,
  setUserHolidays,
  setIsSaving,
  setUserData,
  setUserType,
  setIsLoading,
} from './UserDetailsModal.reducer';
import styles from './UserDetailsModal.module.scss';

const CreateHolidayModal = dynamic(() => import('./CreateHolidayModal'));

const UserDetailsModal = ({ onClose, show, user, currentClinic, role }) => {
  const [
    {
      isSaving,
      userData,
      isCreatingHoliday,
      isLoading,
    },
    localDispatch
  ] = useReducer(reducer, initialState)

  useEffect(() => {
    localDispatch(setUserType(role))
  }, [role]);

  useEffect(() => {
    if (user != null) {
      setTimeout(() => {
        fetchUserDetails();
      }, 300);
    }
  }, [user]);

  const fetchUserDetails = async () => {
    localDispatch(setIsLoading(true));
    try {
      const response = await getUserDetails(user.id);
      const { data: userDetails } = response;
      localDispatch(
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
        })
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsLoading(false));
    }
  };

  const handleModalClose = () => {
    onClose();
    setTimeout(() => handleTabSelect(Role.doctor), 300);
  };

  const handleTabSelect = newKey => {
    localDispatch(setUserType(newKey));
  };

  const handleFormChange = newData => {
    localDispatch(setUserData({ ...userData, ...newData }));
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
    try {
      await updateUserDetails(user.id, requestBody);
      handleModalClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSaveForm = async () => {
    localDispatch(setIsSaving(true));
    await saveUser();
    localDispatch(setIsSaving(false));
  };

  const handleCreateHoliday = holiday => {
    localDispatch(setIsCreatingHoliday({ open: true, holiday: holiday }));
  };

  const handleHolidayDelete = async holiday => {
    if (holiday.id == null) {
      const newHolidays = cloneDeep(userData.holidays);
      remove(newHolidays, item => isEqual(item, holiday));
      localDispatch(setUserHolidays(newHolidays));
      return;
    }
    try {
      await deleteUserHoliday(user.id, holiday.id);
      const newHolidays = cloneDeep(userData.holidays);
      remove(newHolidays, item => item.id === holiday.id);
      localDispatch(setUserHolidays(newHolidays));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const areSameHolidays = (first, second) => {
    return (
      (first.id != null && second.id != null && first.id === second.id) ||
      (isEqual(first.startDate, second.startDate) &&
        isEqual(first.endDate, second.endDate))
    )
  }

  const handleSaveHoliday = holiday => {
    let newHolidays = cloneDeep(userData.holidays);
    const exists = newHolidays.some(item => {
      return areSameHolidays(item, holiday)
    })
    if (exists) {
      // holiday already in the list so we need just to update it
      newHolidays = newHolidays.map(item => {
        if (!areSameHolidays(item, holiday)) return item;
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

    localDispatch(setUserHolidays(newHolidays));
    localDispatch(setIsCreatingHoliday({ open: false, holiday: null }))
  };

  const handleCloseHolidayModal = () => {
    localDispatch(setIsCreatingHoliday({ open: false, holiday: null }))
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
      <div className={styles.userDetailsRoot}>
        <div className={styles.content}>
          {!isLoading && (
            <DoctorForm
              currentClinic={currentClinic}
              onCreateHoliday={handleCreateHoliday}
              onDeleteHoliday={handleHolidayDelete}
              onChange={handleFormChange}
              data={userData}
              showSteps={user == null}
            />
          )}
          {isLoading && (
            <div className='progress-bar-wrapper'>
              <CircularProgress classes={{ root: 'circular-progress-bar'}}/>
            </div>
          )}
        </div>
        <div className={styles.footer}>
          <Button className='cancel-button' onClick={handleModalClose}>
            {textForKey('Close')}
            <IconClose/>
          </Button>
          <LoadingButton
            onClick={handleSaveForm}
            className='positive-button'
            disabled={isSaving || isLoading}
            isLoading={isSaving}
          >
            {textForKey('Save')}
            {!isSaving && <IconSuccess/>}
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
