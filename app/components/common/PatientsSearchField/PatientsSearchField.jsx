import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import getPatientName from 'app/utils/getPatientName';
import onRequestError from 'app/utils/onRequestError';
import { getPatients } from 'middleware/api/patients';
import EASAutocomplete from '../EASAutocomplete';

const PatientsSearchField = ({
  selectedPatient,
  fieldLabel,
  disabled,
  helperText,
  canCreate = true,
  containerClass,
  onSelected,
  onCreatePatient,
}) => {
  const textForKey = useTranslate();
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const suggestionPatients = useMemo(() => {
    if (patients.length === 0 && selectedPatient != null) {
      return [
        {
          ...selectedPatient,
          name: `${selectedPatient.fullName} +${selectedPatient.countryCode}${selectedPatient.phoneNumber}`,
          label: patients.fullName,
        },
      ];
    }
    return patients.map((item) => ({
      ...item,
      name: `${item.fullName} +${item.countryCode}${item.phoneNumber}`,
      label: item.fullName,
    }));
  }, [patients, selectedPatient]);

  const getLabelKey = useCallback((option) => {
    return getPatientName(option);
  }, []);

  const handlePatientSearch = useCallback(
    debounce(async (query) => {
      setIsLoading(true);
      try {
        const updatedQuery = query.replace(/^([+0])/, '');
        const requestQuery = {
          query: updatedQuery,
          page: '0',
          rowsPerPage: '10',
          short: '1',
        };
        const { data: response } = await getPatients(requestQuery);
        const patients = response.data.map((item) => ({
          ...item,
          fullName: getLabelKey(item),
        }));
        setPatients(patients);
      } catch (error) {
        onRequestError(error);
      } finally {
        setIsLoading(false);
      }
    }, 700),
    [],
  );

  const handleSearchQueryChange = (event) => {
    const query = event.target.value;
    if (query.length < 1) {
      setPatients([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    handlePatientSearch(query);
  };

  const handlePatientChange = (event, selectedPatient) => {
    onSelected?.(selectedPatient);
  };

  return (
    <EASAutocomplete
      canCreate={canCreate}
      containerClass={containerClass}
      disabled={disabled}
      fieldLabel={fieldLabel}
      options={suggestionPatients}
      onTextChange={handleSearchQueryChange}
      onChange={handlePatientChange}
      onCreateOption={onCreatePatient}
      helperText={helperText}
      value={selectedPatient || ''}
      loading={isLoading}
      placeholder={textForKey('enter patient name or phone')}
    />
  );
};

export default PatientsSearchField;

PatientsSearchField.propTypes = {
  selectedPatient: PropTypes.any,
  fieldLabel: PropTypes.string,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  containerClass: PropTypes.any,
  onSelected: PropTypes.func,
  onCreatePatient: PropTypes.func,
};

PatientsSearchField.defaultProps = {
  containerClass: null,
  disabled: false,
  fieldLabel: '',
  selectedPatient: null,
  onSelected: () => null,
  onCreatePatient: () => null,
};
