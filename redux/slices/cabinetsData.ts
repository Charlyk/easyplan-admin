import { createSlice } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';
import { ClinicCabinet } from 'types';

interface StateSlice {
  cabinets: ClinicCabinet[];
}

const cabinetsData = createSlice({
  name: 'cabinetsData',
  initialState: initialState.cabinetsData as StateSlice,
  reducers: {
    addNewCabinet(state, action) {
      state.cabinets.push(action.payload);
    },
    setCabinets(state, action) {
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
          (doctor) => doctor.id !== doctorId,
        );

        return { ...cabinet, users: filteredUsers };
      });
    },
    addDoctorToCabinet(state, action) {
      const { cabinetId, selectedItemsArr } = action.payload;
      state.cabinets = state.cabinets.map((cabinet) => {
        if (cabinet.id !== cabinetId) return cabinet;

        const updatedUsers = [...cabinet.users, ...selectedItemsArr];
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
