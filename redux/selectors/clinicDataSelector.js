import { createSelector } from "reselect";

export const clinicDataSelector = (state) => state.clinicData;

export const updateClinicDataSelector = createSelector(clinicDataSelector, (clinicData) => clinicData?.updateClinicData);
