import React from 'react';

import PropTypes from 'prop-types';
import { Form, InputGroup, Spinner } from 'react-bootstrap';

import IconPlus from '../../../../assets/icons/iconPlus';
import { textForKey } from '../../../../utils/localization';
import PatientItem from './PatientItem';

const PatientsList = ({
  onAdd,
  isFetching,
  onSearch,
  onSelect,
  patients,
  selectedPatient,
}) => {
  const handleSearchChange = event => {
    onSearch(event.target.value);
  };

  return (
    <div className='patients-root__list'>
      <div className='patients-root__list__header'>
        <div className='title-container'>{textForKey('All patients')}</div>
        <Form.Group>
          <InputGroup>
            <Form.Control
              placeholder={`${textForKey('Search')}...`}
              type='text'
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Form.Group>
      </div>
      <div className='patients-root__list__content'>
        {isFetching && (
          <Spinner className='loading-spinner' animation='border' />
        )}
        {patients.map(patient => (
          <PatientItem
            onSelected={onSelect}
            key={patient.id}
            selected={patient.id === selectedPatient?.id}
            patient={patient}
          />
        ))}
      </div>
      <div
        role='button'
        tabIndex={0}
        className='patients-root__list__add-btn'
        onClick={onAdd}
      >
        <IconPlus fill='#CDCEEA' />
        {textForKey('Add patient')}
      </div>
    </div>
  );
};

export default PatientsList;

PatientsList.propTypes = {
  selectedPatient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    photo: PropTypes.string,
  }),
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
      photo: PropTypes.string,
    }),
  ),
  isFetching: PropTypes.bool,
  onSelect: PropTypes.func,
  onAdd: PropTypes.func,
  onSearch: PropTypes.func,
};

PatientsList.defaultProps = {
  onAdd: () => null,
  onSelect: () => null,
  onSearch: () => null,
};
