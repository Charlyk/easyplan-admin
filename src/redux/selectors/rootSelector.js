export const updateCategoriesSelector = state => state.updateCategories;

export const updateUsersSelector = state => state.updateUsers;

export const updateNotesSelector = state => state.updateNotes;

export const updateXRaySelector = state => state.updateXRay;

export const updateCurrentUserSelector = state => state.updateCurrentUser;

export const newClinicIdSelector = state => state.newClinicId;

export const createClinicSelector = state => state.createClinic;

export const logoutSelector = state => state.logout;

export const appointmentModalSelector = state => state.appointmentModal;

export const updateAppointmentsSelector = state => state.updateAppointments;

/**
 * Get current user from store
 * @param state
 * @return {{
 *   id: string,
 *   firstName: string,
 *   lastName: string,
 *   username: string,
 *   avatar: string,
 *   clinicIds: [string],
 *   clinics: [{id: string, clinicName: string, roleInClinic: string, userStatus: string}],
 * }}
 */
export const userSelector = state => state.user;
