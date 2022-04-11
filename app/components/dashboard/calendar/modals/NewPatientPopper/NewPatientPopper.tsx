import React, { useState, useMemo } from 'react';
import {
  LoadingButton,
  PhoneField,
  SelectMenu,
  TextField,
} from '@easyplanpro/easyplan-components';
import { Popper, Paper, ClickAwayListener } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { PatientSources } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import { patientsLoadingSelector } from 'redux/selectors/patientsSelector';
import { dispatchCreateAppointmentPatient } from 'redux/slices/patientsSlice';
import { NewPatientPopperProps } from '.';
import styles from './NewPatientPopper.module.css';

const blankFormData = {
  fullName: '',
  source: 'Unknown',
  phoneNumber: '',
  countryCode: '',
};

const NewPatientPopper: React.FC<NewPatientPopperProps> = ({
  onClose,
  anchorEl,
  placement,
  popperRef,
  ...props
}) => {
  const [formData, setFormData] = useState(blankFormData);
  const dispatch = useDispatch();
  const loading = useSelector(patientsLoadingSelector);

  const mappedPatientSources = useMemo(() => {
    const defaultOption = {
      id: 'unspecified',
      name: textForKey('source.unspecified'),
    };

    return [defaultOption, ...PatientSources];
  }, []);

  const handleSubmitForm = (evt: React.FormEvent) => {
    evt.preventDefault();
    const [firstName, lastName] = formData.fullName.split(' ');

    dispatch(
      dispatchCreateAppointmentPatient({
        firstName: firstName ?? '',
        lastName: lastName ?? '',
        source: formData.source,
        phoneNumber: formData.phoneNumber,
        countryCode: formData.countryCode,
      }),
    );
  };

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((formData) => ({
      ...formData,
      [evt.target.name]: evt.target.value,
    }));
  };

  const handleSourceChange = (evt: any) => {
    setFormData((formData) => ({
      ...formData,
      source: String(evt.target.value),
    }));
  };

  const handlePhoneInputChange = (
    phoneNumber: string,
    countryData: { name: string; dialCode: string; countryCode: string },
  ) => {
    setFormData((formData) => ({
      ...formData,
      phoneNumber,
      countryCode: countryData.dialCode ?? '',
    }));
  };

  return (
    <Popper
      anchorEl={anchorEl as any}
      placement={placement as any}
      popperRef={popperRef as any}
      {...props}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Paper classes={{ root: styles.paper }}>
          <form className={styles.patientForm} onSubmit={handleSubmitForm}>
            <TextField
              label={textForKey('appointment_name')}
              name='fullName'
              value={formData.fullName}
              fullWidth
              onChange={handleInputChange}
            />
            <PhoneField
              label={textForKey('appointment_phone')}
              name='phoneNumber'
              value={formData.phoneNumber}
              fullWidth
              onChange={handlePhoneInputChange}
              defaultCountry='md'
            />
            <SelectMenu
              label={textForKey('appointment_source')}
              name='source'
              value={formData.source}
              fullWidth
              onChange={handleSourceChange}
              options={mappedPatientSources}
            />
            <LoadingButton
              variant='text'
              type='submit'
              label={textForKey('create patient')}
              loading={loading}
              dense
            />
          </form>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default NewPatientPopper;
