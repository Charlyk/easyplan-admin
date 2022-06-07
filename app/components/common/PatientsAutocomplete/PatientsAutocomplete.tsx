import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  EASAutocomplete,
  OptionType,
  Typography,
} from '@easyplanpro/easyplan-components';
import { MenuItem } from '@material-ui/core';
import debounce from 'lodash/debounce';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import { patientsAutocompleteSelector } from 'redux/selectors/patientsAutocompleteSelector';
import {
  dispatchFetchFilteredPatients,
  resetData,
} from 'redux/slices/patientsAutocompleteSlice';
import { PatientsAutocompleteProps } from '.';
import { NewPatientPopper } from '../NewPatientPopper';
import styles from './PatientsAutocomplete.module.css';

const PatientsAutocomplete: React.FC<PatientsAutocompleteProps> = ({
  className,
  onSelect,
  value,
}) => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const newClientRef = useRef<HTMLDivElement>(null);
  const requestInitiated = useRef(false);
  const [newPatientPopperOpen, setNewPatientPopperOpen] = useState(false);
  const { data, loading } = useSelector(patientsAutocompleteSelector);

  useEffect(() => {
    if (!loading) return;
    requestInitiated.current = true;
  }, [loading]);

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
      id: -1,
      fullName: `${textForKey('appointment_placeholder')}`,
    };
    const addNewPatientOption = {
      id: 0,
      fullName: `${textForKey('new patient')} +`,
    };
    if (data.length === 0)
      return requestInitiated.current ? [addNewPatientOption] : [defaultOption];
    return [...data, addNewPatientOption] as unknown as OptionType[];
  }, [data, loading, requestInitiated.current]);

  const handleValueChange = useCallback(
    debounce((evt: React.ChangeEvent<HTMLInputElement>) => {
      const query = evt.target.value;

      if (query.length >= 1) {
        dispatch(dispatchFetchFilteredPatients(evt.target.value));
      } else {
        dispatch(resetData());
      }
    }, 500),
    [],
  );

  const handleNewPatientClose = () => {
    setNewPatientPopperOpen(false);
  };

  const handleNewPatientClick = () => {
    setNewPatientPopperOpen(true);
  };

  const filterOptions = (options: any) => options;

  const renderOption = (props: any, option: any) => {
    return (
      <MenuItem
        {...props}
        onClick={option.id === 0 ? handleNewPatientClick : props.onClick}
      >
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
    <div className={className} ref={newClientRef}>
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
      <NewPatientPopper
        anchorEl={newClientRef.current}
        open={newPatientPopperOpen}
        className={styles.newPatientPopper}
        placement='right'
        onClose={handleNewPatientClose}
      />
    </div>
  );
};

export default PatientsAutocomplete;
