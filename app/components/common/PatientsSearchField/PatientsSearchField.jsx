import React, { useCallback, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { getPatients } from "../../../../middleware/api/patients";
import onRequestError from "../../../utils/onRequestError";
import { textForKey } from "../../../utils/localization";
import EASAutocomplete from "../EASAutocomplete";

const PatientsSearchField = ({ selectedPatient, fieldLabel, disabled, containerClass, onSelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const suggestionPatients = useMemo(() => {
    if (patients.length === 0 && selectedPatient != null) {
      return [{
        ...selectedPatient,
        name: `${selectedPatient.fullName} +${selectedPatient.countryCode}${selectedPatient.phoneNumber}`,
        label: patients.fullName,
      }]
    }
    return patients.map(item => ({
      ...item,
      name: `${item.fullName} +${item.countryCode}${item.phoneNumber}`,
      label: item.fullName,
    }))
  }, [patients, selectedPatient]);

  const getLabelKey = useCallback((option) => {
    if (option.firstName && option.lastName) {
      return `${option.lastName} ${option.firstName}`
    } else if (option.firstName) {
      return option.firstName
    } else if (option.lastName) {
      return option.lastName
    } else {
      return `+${option.countryCode}${option.phoneNumber}`
    }
  }, []);

  const handlePatientSearch = useCallback(
    debounce(async (query) => {
      setIsLoading(true)
      try {
        const updatedQuery = query.replace('+', '');
        const requestQuery = { query: updatedQuery, page: '0', rowsPerPage: '10', short: '1' };
        const { data: response } = await getPatients(requestQuery);
        const patients = response.data.map((item) => ({
          ...item,
          fullName: getLabelKey(item),
        }));
        setPatients(patients);
      } catch (error) {
        onRequestError(error)
      } finally {
        setIsLoading(false)
      }
    }, 700),
    [],
  );

  const handleSearchQueryChange = (event) => {
    const query = event.target.value;
    if (query.length < 3) {
      setPatients([])
      setIsLoading(false)
      return;
    }
    setIsLoading(true)
    handlePatientSearch(query);
  };

  const handlePatientChange = (event, selectedPatient) => {
    onSelected?.(selectedPatient);
  };

  return (
    <EASAutocomplete
      containerClass={containerClass}
      disabled={disabled}
      fieldLabel={fieldLabel}
      options={suggestionPatients}
      onTextChange={handleSearchQueryChange}
      onChange={handlePatientChange}
      value={selectedPatient || ''}
      loading={isLoading}
      placeholder={textForKey('Enter patient name or phone')}
    />
  )
}

export default PatientsSearchField;
