import { combineReducers } from 'redux';

import initialState from '../initialState';
import types from '../types/types';
import appointmentModal from './appointmentModal';
import clinic from './clinic';
import createClinicModal from './createClinicModal';
import patientNoteModal from './patientNoteModal';
import patientXRayModal from './patientXRayModal';
import paymentModal from './paymentModal';

export default combineReducers({
  main,
  clinic,
  patientNoteModal,
  patientXRayModal,
  appointmentModal,
  paymentModal,
  createClinicModal,
});

function main(state = initialState, action) {
  switch (action.type) {
    case types.updateCategoriesList:
      return {
        ...state,
        updateCategories: !state.updateCategories,
      };
    case types.updateUsersList:
      return {
        ...state,
        updateUsers: !state.updateUsers,
      };
    case types.updateXRay:
      return {
        ...state,
        updateXRay: !state.updateXRay,
      };
    case types.updateNotes:
      return {
        ...state,
        updateNotes: !state.updateNotes,
      };
    case types.setUser:
      return {
        ...state,
        user: action.payload,
      };
    case types.setUpdateCurrentUser:
      return {
        ...state,
        updateCurrentUser: !state.updateCurrentUser,
      };
    case types.changeCurrentClinic:
      return {
        ...state,
        newClinicId: action.payload,
      };
    case types.triggerUserLogOut:
      return {
        ...state,
        logout: action.payload,
      };
    case types.updateAppointmentsList:
      return {
        ...state,
        updateAppointments: !state.updateAppointments,
      };
    default:
      return state;
  }
}
