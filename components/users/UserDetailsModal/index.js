import React, { useEffect, useReducer } from 'react';

import { remove, cloneDeep, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import styles from '../../../styles/UserDetailsModal.module.scss';
import IconClose from '../../icons/iconClose';
import IconSuccess from '../../icons/iconSuccess';
import { Role } from '../../../utils/constants';
import { generateReducerActions } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import LeftSideModal from '../../../src/components/LeftSideModal';
import LoadingButton from '../../LoadingButton';
import CreateHolidayModal from './CreateHolidayModal';
import DoctorForm from './DoctorForm';
import axios from "axios";
import { baseAppUrl } from "../../../eas.config";
import { CircularProgress } from "@material-ui/core";

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
  userType: Role.doctor,
};

const initialState = {
  currentTab: Role.doctor,
  isSaving: false,
  isLoading: false,
  userData: initialData,
  isCreatingHoliday: {
    open: false,
    holiday: null,
  }
};

const reducerTypes = {
  setCurrentTab: 'setCurrentTab',
  setIsSaving: 'setIsSaving',
  setIsLoading: 'setIsLoading',
  setUserData: 'setUserData',
  setIsCreatingHoliday: 'setIsCreatingHoliday',
  setUserType: 'setUserType',
  setUserHolidays: 'setUserHolidays',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setCurrentTab:
      return { ...state, currentTab: action.payload };
    case reducerTypes.setIsSaving:
      return { ...state, isSaving: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setUserData:
      return { ...state, userData: action.payload };
    case reducerTypes.setIsCreatingHoliday:
      return { ...state, isCreatingHoliday: action.payload };
    case reducerTypes.setUserType:
      return {
        ...state,
        userData: {
          ...state.userData,
          userType: action.payload,
        },
      };
    case reducerTypes.setUserHolidays:
      return {
        ...state,
        userData: {
          ...state.userData,
          holidays: action.payload,
        },
      }
    default:
      return state;
  }
}

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
    localDispatch(actions.setUserType(role))
  }, [role]);

  useEffect(() => {
    if (user != null) {
      setTimeout(() => {
        fetchUserDetails();
      }, 300);
    }
  }, [user]);

  const fetchUserDetails = async () => {
    localDispatch(actions.setIsLoading(true));
    try {
      const response = await axios.get(`${baseAppUrl}/api/users/${user.id}`);
      const { data: userDetails } = response;
      localDispatch(
        actions.setUserData({
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
      localDispatch(actions.setIsLoading(false));
    }
  };

  const handleModalClose = () => {
    onClose();
    setTimeout(() => handleTabSelect(Role.doctor), 300);
  };

  const handleTabSelect = newKey => {
    localDispatch(actions.setUserType(newKey));
  };

  const handleFormChange = newData => {
    localDispatch(actions.setUserData({ ...userData, ...newData }));
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
      await axios.put(`${baseAppUrl}/api/users/${user.id}`, requestBody);
      handleModalClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSaveForm = async () => {
    localDispatch(actions.setIsSaving(true));
    await saveUser();
    localDispatch(actions.setIsSaving(false));
  };

  const handleCreateHoliday = holiday => {
    localDispatch(actions.setIsCreatingHoliday({ open: true, holiday: holiday }));
  };

  const handleHolidayDelete = async holiday => {
    if (holiday.id == null) {
      const newHolidays = cloneDeep(userData.holidays);
      remove(newHolidays, item => isEqual(item, holiday));
      localDispatch(actions.setUserHolidays(newHolidays));
      return;
    }
    try {
      await axios.delete(`${baseAppUrl}/api/users/${user.id}/holidays/${holiday.id}`);
      const newHolidays = cloneDeep(userData.holidays);
      remove(newHolidays, item => item.id === holiday.id);
      localDispatch(actions.setUserHolidays(newHolidays));
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

    localDispatch(actions.setUserHolidays(newHolidays));
    localDispatch(actions.setIsCreatingHoliday({ open: false, holiday: null }))
  };

  const handleCloseHolidayModal = () => {
    localDispatch(actions.setIsCreatingHoliday({ open: false, holiday: null }))
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
      <div className={styles['user-details-root']}>
        <div className={styles['user-details-root__content']}>
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
        <div className={styles['user-details-root__footer']}>
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
