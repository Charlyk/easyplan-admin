const clinicIdKey = 'eas-cl-id';

export default {
  /**
   * Save selected clinic id to session storage
   * @param {any} clinicId
   */
  setSelectedClinicId: clinicId => {
    sessionStorage.setItem(clinicIdKey, String(clinicId));
  },

  /**
   * Get selected clinic id from session storage
   * return {number}
   */
  getSelectedClinicId: () => {
    const clinicId = sessionStorage.getItem(clinicIdKey);
    if (clinicId != null && clinicId.length > 0) {
      return parseInt(clinicId);
    }
    return -1;
  },

  removeSelectedClinicId: () => {
    sessionStorage.removeItem(clinicIdKey);
  },
};
