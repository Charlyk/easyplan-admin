import initialState from '../initialState';
import types from '../types/types';

export default function rootReducer(state = initialState, action) {
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
    case types.setCreateClinic:
      return {
        ...state,
        createClinic: action.payload,
      };
    case types.triggerUserLogOut:
      return {
        ...state,
        logout: action.payload,
      };
    case types.setAppointmentModal:
      return {
        ...state,
        appointmentModal: {
          ...action.payload,
          date: action.payload.open ? action.payload.date : null,
          doctor: action.payload.open ? action.payload.doctor : null,
        },
      };
    case types.updateAppointmentsList:
      return {
        ...state,
        updateAppointments: !state.updateAppointments,
      };
    case types.setAddPatientNote:
      return {
        ...state,
        patientNoteModal: action.payload,
      };
    case types.setAddPatientXRay:
      return {
        ...state,
        patientXRayModal: action.payload,
      };
    default:
      return state;
  }
}
