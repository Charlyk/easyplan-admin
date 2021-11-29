import { baseUrl } from 'eas.config';

/**
 * Build an url for treatment plan printing
 * @param {{id: string}} clinic
 * @param {string} token
 * @param {string} patientId
 * @param {string} guideName
 * @return {string}
 */
const getTreatmentPlanURL = (clinic, token, patientId, guideName) => {
  const queryParams = new URLSearchParams({
    patientId: patientId,
    clinicId: clinic.id,
    token,
    guideName,
  }).toString();
  return `${baseUrl}/treatment-plans/print-plan?${queryParams}`;
};

export default getTreatmentPlanURL;
