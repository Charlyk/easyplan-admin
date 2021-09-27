const getPatientName = (patient) => {
  if (patient.firstName && patient.lastName) {
    return `${patient.firstName} ${patient.lastName}`;
  } else if (patient.firstName && !patient.lastName) {
    return patient.firstName
  } else if (!patient.firstName && patient.lastName) {
    return patient.lastName;
  } else {
    return patient.phoneWithCode;
  }
};

export default getPatientName;
