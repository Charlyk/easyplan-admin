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
      schedules.filter(item => {
        return (
          (filterData.patientName.length === 0 ||
            item.patientName
              .toLowerCase()
              .includes(filterData.patientName.toLowerCase())) &&
          (filterData.serviceId === 'all' ||
            item.serviceId === filterData.serviceId) &&
          (filterData.appointmentStatus === 'all' ||
            filterData.appointmentStatus === item.status)
        );
      }),
    );
  };

  return (
    <div className='patients-list-root'>
      {filteredSchedules.map(schedule => (
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
  filterData: PropTypes.shape({
    patientName: PropTypes.string,
    serviceId: PropTypes.string,
    appointmentStatus: PropTypes.string,
  }),
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
