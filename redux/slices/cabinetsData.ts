import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';
import { ClinicCabinet } from 'types';

const cabinetsData = createSlice({
  name: 'cabinetsData',
  initialState: initialState.cabinetsData,
  reducers: {
    addNewCabinet(state, action: PayloadAction<ClinicCabinet>) {
      state.cabinets = [...state.cabinets, action.payload];
    },
    setCabinets(state, action: PayloadAction<ClinicCabinet[]>) {
      state.cabinets = action.payload;
    },
    deleteCabinet(state, action) {
      const deletedCabinetId = action.payload;
      state.cabinets = state.cabinets.filter(
        (cabinet) => cabinet.id !== deletedCabinetId,
      );
    },
    updateCabinet(state, action) {
      const cabinetToUpdate = action.payload;
      state.cabinets = state.cabinets.map((cabinet) => {
        if (cabinet.id !== cabinetToUpdate.id) return cabinet;

        return { ...cabinet, ...cabinetToUpdate };
      });
    },
    deleteDoctorFromCabinet(state, action) {
      const { cabinetId, doctorId } = action.payload;
      state.cabinets = state.cabinets.map((cabinet) => {
        if (cabinet.id !== cabinetId) return cabinet;

        const filteredUsers = cabinet.users.filter(
          (user) => user.user.id !== doctorId,
        );

        return { ...cabinet, users: filteredUsers };
      });
    },
    addDoctorToCabinet(state, action) {
      const { cabinetId, users } = action.payload;
      state.cabinets = state.cabinets.map((cabinet) => {
        if (cabinet.id !== cabinetId) return cabinet;

        const updatedUsers = [...cabinet.users, ...users];
        return { ...cabinet, users: updatedUsers };
      });
    },
  },
});

export const {
  addNewCabinet,
  setCabinets,
  deleteCabinet,
  updateCabinet,
  deleteDoctorFromCabinet,
  addDoctorToCabinet,
} = cabinetsData.actions;

export default cabinetsData.reducer;
