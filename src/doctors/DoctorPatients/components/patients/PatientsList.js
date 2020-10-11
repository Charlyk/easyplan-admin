import React from 'react';

import PropTypes from 'prop-types';

import DoctorPatientItem from './DoctorPatientItem';

const PatientsList = ({ schedules, onPatientSelect }) => {
  return (
    <div className='patients-list-root'>
      {schedules.map(schedule => (
        <DoctorPatientItem
          key={schedule.id}
          schedule={schedule}
          onView={onPatientSelect}
        />
      ))}
    </div>
  );
};

export default PatientsList;

PatientsList.propTypes = {
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      patientId: PropTypes.string,
      patientName: PropTypes.string,
      patientPhone: PropTypes.string,
      patientPhoto: PropTypes.string,
      doctorId: PropTypes.string,
      doctorName: PropTypes.string,
      serviceId: PropTypes.string,
      serviceName: PropTypes.string,
      serviceColor: PropTypes.string,
      serviceDuration: PropTypes.number,
      dateAndTime: PropTypes.string,
      status: PropTypes.string,
      note: PropTypes.string,
    }),
  ),
  onPatientSelect: PropTypes.func,
};

PatientsList.defaultProps = {
  onPatientSelect: () => null,
};
