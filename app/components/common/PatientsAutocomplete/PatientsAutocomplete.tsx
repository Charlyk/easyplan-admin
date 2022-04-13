import React, { useCallback, useMemo } from 'react';
import {
  EASAutocomplete,
  OptionType,
  Typography,
} from '@easyplanpro/easyplan-components';
import { MenuItem } from '@material-ui/core';
import debounce from 'lodash/debounce';
import { useDispatch, useSelector } from 'react-redux';
import { textForKey } from 'app/utils/localization';
import { patientsAutocompleteSelector } from 'redux/selectors/patientsAutocompleteSelector';
import {
  dispatchFetchFilteredPatients,
  resetData,
} from 'redux/slices/patientsAutocompleteSlice';
import { PatientsAutocompleteProps } from '.';

const PatientsAutocomplete: React.FC<PatientsAutocompleteProps> = ({
  className,
  onSelect,
  value,
}) => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(patientsAutocompleteSelector);

  const selectedPatient = useMemo(() => {
    if (!data)
      return {
        id: 0,
        name: 'No Patient Selected',
        fullName: textForKey('appointment.noPatient'),
      };
    return data?.find(
      (patient) => patient.id === value,
    ) as unknown as OptionType;
  }, [data, value]);

  const mappedOptions = useMemo(() => {
    const defaultOption = {
      id: 0,
      fullName: textForKey('appointment.noPatient'),
    };
    if (!data) return [defaultOption];

    return data as unknown as OptionType[];
  }, [data]);

  const handleValueChange = useCallback(
    debounce((evt: React.ChangeEvent<HTMLInputElement>) => {
      const query = evt.target.value;

      if (query.length > 3) {
        dispatch(dispatchFetchFilteredPatients(evt.target.value));
      } else {
        dispatch(resetData());
      }
    }, 500),
    [],
  );

  const filterOptions = (options: any) => options;

  const renderOption = (props: any, option: any) => {
    return (
      <MenuItem {...props}>
        <Typography variant='bodySmall'>{option.fullName}</Typography>
      </MenuItem>
    );
  };

  const getOptionLabel = (option: any) => {
    return `${option?.fullName}`;
  };

  const handleOptionChange = (_: any, value: any) => {
    onSelect?.(value?.id);
  };

  return (
    <div className={className}>
      <EASAutocomplete
        loading={loading}
        options={(mappedOptions as any) ?? []}
        onChange={handleOptionChange}
        filterOptions={filterOptions}
        renderOption={renderOption}
        getOptionLabel={getOptionLabel}
        onTextChange={handleValueChange}
        label={textForKey('appointment_patient')}
        noOptionsText={textForKey('no options')}
        loadingText={textForKey('appointment_searching')}
        placeholder={textForKey('appointment_placeholder')}
        fullWidth
        value={selectedPatient}
      />
    </div>
  );
};

export default PatientsAutocomplete;
