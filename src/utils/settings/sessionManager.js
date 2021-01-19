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
    if (sessionStorage.key(clinicIdKey) == null) {
      return -1;
    }

    const clinicId = sessionStorage.getItem(clinicIdKey);
    if (clinicId != null && clinicId.length > 0) {
      try {
        const parsedId = parseInt(clinicId);
        if (Number.isNaN(parsedId)) return -1;
        return parsedId;
      } catch (e) {
        return -1;
      }
    }
    return -1;
  },

  removeSelectedClinicId: () => {
    sessionStorage.removeItem(clinicIdKey);
  },
};