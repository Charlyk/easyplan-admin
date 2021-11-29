import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import EASTextField from 'app/components/common/EASTextField';
import EasyDateRangePicker from 'app/components/common/EasyDateRangePicker';
import PatientsSearchField from 'app/components/common/PatientsSearchField/PatientsSearchField';
import IconClose from 'app/components/icons/iconClose';
import { Role } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import EASSelect from '../../../common/EASSelect';
import styles from './CrmFilters.module.scss';
import reducer, {
  defaultRange,
  reminderOptions,
  initialState,
  Shortcuts,
  setPatient,
  setSelectedDoctors,
  setSelectedReminder,
  setSelectedServices,
  setSelectedUsers,
  setDateRange,
  setShowRangePicker,
  setSelectedStates,
  setSelectedShortcut,
  resetState,
} from './CrmFilters.reducer';

const CrmFilters = ({
  selectedParams,
  currentClinic,
  dealsStates,
  onClose,
  onShortcutSelected,
  onSubmit,
}) => {
  const [
    {
      patient,
      selectedDoctors,
      selectedReminder,
      selectedServices,
      selectedUsers,
      selectedDateRange,
      showRangePicker,
      selectedStates,
      selectedShortcut,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const {
    patient: initialPatient,
    doctors: initialDoctors,
    reminder: initialReminder,
    shortcut: initialShortcut,
    services: initialServices,
    users: initialUsers,
    dateRange: initialDateRange,
    states: initialStates,
  } = selectedParams;
  const pickerRef = useRef(null);
  const services = currentClinic.services;
  const doctors = useMemo(() => {
    return currentClinic.users
      .filter((item) => item.roleInClinic === Role.doctor)
      .map((item) => ({
        ...item,
        name: item.fullName,
      }));
  }, [currentClinic]);
  const users = useMemo(() => {
    return currentClinic.users
      .filter((item) => item.roleInClinic !== Role.doctor)
      .map((item) => ({
        ...item,
        name: item.fullName,
      }));
  }, [currentClinic]);
  const dateRangeText = useMemo(() => {
    if (selectedDateRange.length === 0) {
      return '';
    }
    const [start, end] = selectedDateRange;
    return `${moment(start).format('DD.MM.YYYY')} - ${moment(end).format(
      'DD.MM.YYYY',
    )}`;
  }, [selectedDateRange]);

  useEffect(() => {
    setupDealStates();
  }, [initialStates, dealsStates]);

  useEffect(() => {
    localDispatch(setPatient(initialPatient));
  }, [initialPatient]);

  useEffect(() => {
    localDispatch(
      setSelectedDoctors(initialDoctors ?? initialState.selectedDoctors),
    );
  }, [initialDoctors]);

  useEffect(() => {
    localDispatch(
      setSelectedReminder(initialReminder ?? initialState.selectedReminder),
    );
  }, [initialReminder]);

  useEffect(() => {
    localDispatch(
      setSelectedServices(initialServices ?? initialState.selectedServices),
    );
  }, [initialServices]);

  useEffect(() => {
    localDispatch(setSelectedUsers(initialUsers ?? initialState.selectedUsers));
  }, [initialUsers]);

  useEffect(() => {
    localDispatch(
      setSelectedShortcut(initialShortcut ?? initialState.selectedShortcut),
    );
  }, [initialShortcut]);

  useEffect(() => {
    if (initialDateRange == null) {
      return;
    }
    const [start, end] = initialDateRange;
    const startDate = moment(start).toDate();
    const endDate = moment(end).toDate();
    localDispatch(setDateRange([startDate, endDate]));
  }, [initialDateRange]);

  const setupDealStates = () => {
    if (initialStates == null || initialStates.length === 0) {
      localDispatch(
        setSelectedStates(dealsStates.filter((item) => item.visibleByDefault)),
      );
    } else {
      localDispatch(setSelectedStates(initialStates));
    }
  };

  const handlePatientChange = (selectedPatient) => {
    localDispatch(setPatient(selectedPatient));
  };

  const handleCloseFilters = () => {
    onClose?.();
  };

  const handleResetFilters = () => {
    localDispatch(resetState());
    setupDealStates();
    // setTimeout(() => {
    //   handleSubmitFilter();
    // }, 300);
  };

  const handleSubmitFilter = () => {
    const newFilter = {
      patient: patient
        ? {
            id: patient.id,
            name: patient.name,
            label: patient.label,
          }
        : null,
      doctors: selectedDoctors.some((item) => item.id === -1)
        ? null
        : selectedDoctors.map((doctor) => ({
            id: doctor.id,
            name: doctor.name,
          })),
      users: selectedUsers.some((item) => item.id === -1)
        ? null
        : selectedUsers.map((user) => ({ id: user.id, name: user.name })),
      services: selectedServices.some((item) => item.id === -1)
        ? null
        : selectedServices.map((service) => ({
            id: service.id,
            name: service.name,
          })),
      reminder: selectedReminder,
      dateRange: selectedDateRange.length === 0 ? null : selectedDateRange,
      states: selectedStates.map((state) => ({
        id: state.id,
        name: state.name,
      })),
      shortcut: selectedShortcut,
    };
    if (newFilter.patient == null) delete newFilter.patient;
    if (newFilter.doctors == null) delete newFilter.doctors;
    if (newFilter.users == null) delete newFilter.users;
    if (newFilter.services == null) delete newFilter.services;
    if (newFilter.reminder == null) delete newFilter.reminder;
    if (newFilter.dateRange == null) delete newFilter.dateRange;
    if (newFilter.shortcut == null || newFilter.shortcut.id === 0)
      delete newFilter.shortcut;
    onSubmit?.(newFilter);
    handleCloseFilters();
  };

  const handleDoctorChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedDoctors(initialState.selectedDoctors));
      return;
    }
    const newDoctors = doctors.filter((doctor) =>
      newValue.some((item) => item === doctor.id),
    );
    localDispatch(
      setSelectedDoctors(newDoctors.filter((doctor) => doctor.id !== -1)),
    );
  };

  const handleStatesChanged = (event) => {
    const newValue = event.target.value;
    if (newValue.length === 0) {
      localDispatch(
        setSelectedStates(dealsStates.filter((item) => item.visibleByDefault)),
      );
      return;
    }
    const newStates = dealsStates.filter((state) =>
      newValue.some((item) => item === state.id),
    );
    localDispatch(
      setSelectedStates(newStates.filter((state) => state.id !== -1)),
    );
  };

  const handleServicesChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedServices(initialState.selectedServices));
      return;
    }
    const newServices = services.filter((service) =>
      newValue.some((item) => item === service.id),
    );
    localDispatch(
      setSelectedServices(newServices.filter((service) => service.id !== -1)),
    );
  };

  const handleCloseRangePicker = (event) => {
    event?.stopPropagation();
    localDispatch(setShowRangePicker(false));
  };

  const handleOpenRangePicker = (event) => {
    event?.stopPropagation();
    localDispatch(setShowRangePicker(true));
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    localDispatch(setDateRange([startDate, endDate]));
  };

  const handleRemindersChange = (event) => {
    const newValue = event.target.value;
    if (newValue === 0) {
      localDispatch(setSelectedReminder(null));
      return;
    }
    const newReminder = reminderOptions.find(
      (reminder) => newValue === reminder.id,
    );
    localDispatch(setSelectedReminder(newReminder));
  };

  const handleUsersChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedUsers(initialState.selectedUsers));
      return;
    }
    const newUsers = users.filter((user) =>
      newValue.some((item) => item === user.id),
    );
    localDispatch(setSelectedUsers(newUsers.filter((user) => user.id !== -1)));
  };

  const handleShortcutSelected = (shortcut) => {
    if (shortcut.id === 0) {
      onShortcutSelected?.(null);
    } else {
      onShortcutSelected?.({ id: shortcut.id, name: shortcut.name });
    }
    handleCloseFilters();
  };

  const isShortcutSelected = (shortcut) => {
    return (selectedShortcut?.id || 0) === shortcut;
  };

  return (
    <Box className={styles.filterBackdrop} onClick={handleCloseFilters}>
      <Paper className={styles.crmFilters} onClick={handleCloseRangePicker}>
        <div className={styles.titleContainer}>
          <Typography className={styles.title}>
            {textForKey('Filter')}
          </Typography>
          <IconButton
            className={styles.closeButton}
            onClick={handleCloseFilters}
          >
            <IconClose />
          </IconButton>
        </div>
        <div className={styles.container}>
          <div className={styles.dataContainer}>
            <div className={styles.shortcuts}>
              {Shortcuts.map((item) => (
                <Box
                  key={item.id}
                  className={clsx(styles.shortcut, {
                    [styles.selected]: isShortcutSelected(item.id),
                  })}
                  onClick={() => handleShortcutSelected(item)}
                >
                  {item.type === 'reminder' ? (
                    <div
                      className={clsx(styles.reminderIndicator, {
                        [styles.expired]: item.id === 6,
                      })}
                    />
                  ) : null}
                  <Typography className={styles.label}>{item.name}</Typography>
                </Box>
              ))}
            </div>
            <div className={styles.filters}>
              <div className={styles.fieldsContainer}>
                <EASTextField
                  readOnly
                  ref={pickerRef}
                  value={dateRangeText}
                  placeholder='01.01.2021 - 30.01.2021'
                  fieldLabel={textForKey('Period')}
                  containerClass={styles.simpleField}
                  onClick={handleOpenRangePicker}
                />

                <PatientsSearchField
                  selectedPatient={patient}
                  containerClass={styles.simpleField}
                  fieldLabel={textForKey('Patient')}
                  onSelected={handlePatientChange}
                />

                <EASSelect
                  multiple
                  updateText
                  rootClass={styles.simpleField}
                  label={textForKey('States')}
                  labelId='doctors-select-label'
                  options={dealsStates}
                  value={selectedStates?.map((item) => item.id) || []}
                  onChange={handleStatesChanged}
                />

                <EASSelect
                  multiple
                  rootClass={styles.simpleField}
                  label={textForKey('Doctors')}
                  labelId='doctors-select-label'
                  options={doctors}
                  defaultOption={{
                    id: -1,
                    name: textForKey('All doctors'),
                  }}
                  value={selectedDoctors?.map((item) => item.id) || []}
                  onChange={handleDoctorChange}
                />

                <EASSelect
                  multiple
                  rootClass={styles.simpleField}
                  label={textForKey('Responsible')}
                  labelId='doctors-select-label'
                  options={users}
                  defaultOption={{
                    id: -1,
                    name: textForKey('All users'),
                  }}
                  value={selectedUsers?.map((item) => item.id) || []}
                  onChange={handleUsersChange}
                />

                <EASSelect
                  multiple
                  rootClass={styles.simpleField}
                  label={textForKey('Services')}
                  labelId='doctors-select-label'
                  options={services}
                  defaultOption={{
                    id: -1,
                    name: textForKey('All services'),
                  }}
                  value={selectedServices?.map((item) => item.id) || []}
                  onChange={handleServicesChange}
                />

                <EASSelect
                  rootClass={styles.simpleField}
                  label={textForKey('crm_reminders')}
                  labelId='reminder-select-label'
                  options={reminderOptions}
                  value={selectedReminder?.id ?? 0}
                  onChange={handleRemindersChange}
                />
              </div>
              <div className={styles.footer}>
                <Button onClick={handleCloseFilters}>
                  {textForKey('Close')}
                </Button>
                <Button
                  className={styles.resetBtn}
                  onClick={handleResetFilters}
                >
                  {textForKey('Reset')}
                </Button>
                <Button
                  className={styles.applyBtn}
                  onClick={handleSubmitFilter}
                >
                  {textForKey('Apply')}
                </Button>
              </div>
            </div>
          </div>

          <EasyDateRangePicker
            open={showRangePicker}
            onClose={handleCloseRangePicker}
            onChange={handleDateChange}
            pickerAnchor={pickerRef.current}
            dateRange={{
              startDate: selectedDateRange[0] ?? defaultRange[0],
              endDate: selectedDateRange[1] ?? defaultRange[1],
            }}
          />
        </div>
      </Paper>
    </Box>
  );
};

export default CrmFilters;

CrmFilters.propTypes = {
  selectedShortcut: PropTypes.string,
  onShortcutSelected: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
