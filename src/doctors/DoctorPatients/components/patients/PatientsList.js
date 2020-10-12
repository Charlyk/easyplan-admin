import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import DoctorPatientItem from './DoctorPatientItem';

const PatientsList = ({ schedules, filterData, onPatientSelect }) => {
  const [filteredSchedules, setFilteredSchedules] = useState(schedules);

  useEffect(() => {
    filterPatients();
  }, [filterData]);

  useEffect(() => {
    setFilteredSchedules(schedules);
    filterPatients();
  }, [schedules]);

  const filterPatients = () => {
    setFilteredSchedules(
      schedules.filter(({ patient, schedule }) => {
        return (
          (filterData.patientName.length === 0 ||
            patient.fullName
              .toLowerCase()
              .includes(filterData.patientName.toLowerCase()) ||
            patient.phoneNumber.includes(
              filterData.patientName.toLowerCase(),
            )) &&
          (schedule == null ||
            filterData.serviceId === 'all' ||
            schedule.serviceId === filterData.serviceId) &&
          (schedule == null ||
            filterData.appointmentStatus === 'all' ||
            filterData.appointmentStatus === patient.status)
        );
      }),
    );
  };

  return (
    <div className='patients-list-root'>
      {filteredSchedules.map(({ patient, schedule }) => (
        <DoctorPatientItem
          key={patient.id}
          schedule={schedule}
          patient={patient}
          onView={onPatientSelect}
        />
      ))}
    </div>
  );
};

export default PatientsList;

PatientsList.propTypes = {
  filterData: PropTypes.shape({
    patientName: PropTypes.string,
    serviceId: PropTypes.string,
    appointmentStatus: PropTypes.string,
  }),
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      schedule: PropTypes.shape({
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
      patient: PropTypes.shape({
        id: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        fullName: PropTypes.string,
        email: PropTypes.string,
        phoneNumber: PropTypes.string,
        photo: PropTypes.string,
      }),
    }),
  ),
  onPatientSelect: PropTypes.func,
};

PatientsList.defaultProps = {
  onPatientSelect: () => null,
};
