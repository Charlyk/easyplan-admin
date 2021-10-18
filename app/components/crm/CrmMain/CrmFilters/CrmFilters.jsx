import React, { useEffect, useMemo, useReducer, useRef } from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import moment from "moment-timezone";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import PatientsSearchField from "../../../common/PatientsSearchField/PatientsSearchField";
import EasyDateRangePicker from "../../../common/EasyDateRangePicker";
import EASTextField from "../../../common/EASTextField";
import EASSelect from "../../../common/EASSelect";
import { textForKey } from "../../../../utils/localization";
import { Role } from "../../../../utils/constants";
import IconClose from "../../../icons/iconClose";
import reducer, {
  defaultRange,
  reminderOptions,
  initialState,
  Shortcuts,
  setPatient,
  setSelectedDoctors,
  setSelectedReminders,
  setSelectedServices,
  setSelectedUsers,
  setDateRange,
  setShowRangePicker,
} from './CrmFilters.reducer';
import styles from './CrmFilters.module.scss';

const CrmFilters = (
  {
    selectedParams,
    currentClinic,
    onClose,
    onShortcutSelected,
    onSubmit,
  }
) => {
  const [{
    patient,
    selectedDoctors,
    selectedReminders,
    selectedServices,
    selectedUsers,
    selectedDateRange,
    showRangePicker,
  }, localDispatch] = useReducer(reducer, initialState);

  const {
    patient: initialPatient,
    doctors: initialDoctors,
    reminders: initialReminders,
    shortcut: selectedShortcut,
    services: initialServices,
    users: initialUsers,
    dateRange: initialDateRange,
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
      return ''
    }
    const [start, end] = selectedDateRange;
    return `${moment(start).format('DD.MM.YYYY')} - ${moment(end).format('DD.MM.YYYY')}`
  }, [selectedDateRange]);

  useEffect(() => {
    localDispatch(setPatient(initialPatient));
  }, [initialPatient]);

  useEffect(() => {
    localDispatch(setSelectedDoctors(initialDoctors ?? initialState.selectedDoctors));
  }, [initialDoctors]);

  useEffect(() => {
    localDispatch(setSelectedReminders(initialReminders ?? initialState.selectedReminders));
  }, [initialReminders]);

  useEffect(() => {
    localDispatch(setSelectedServices(initialServices ?? initialState.selectedServices));
  }, [initialServices]);

  useEffect(() => {
    localDispatch(setSelectedUsers(initialUsers ?? initialState.selectedUsers));
  }, [initialUsers]);

  useEffect(() => {
    if (initialDateRange == null) {
      return;
    }
    const [start, end] = initialDateRange;
    const startDate = moment(start).toDate();
    const endDate = moment(end).toDate();
    localDispatch(setDateRange([startDate, endDate]));
  }, [initialDateRange]);

  const handlePatientChange = (selectedPatient) => {
    localDispatch(setPatient(selectedPatient));
  };

  const handleCloseFilters = () => {
    onClose?.();
  };

  const handleSubmitFilter = () => {
    const newFilter = {
      patient,
      doctors: selectedDoctors.some(item => item.id === -1)
        ? null
        : selectedDoctors,
      users: selectedUsers.some(item => item.id === -1)
        ? null
        : selectedUsers,
      services: selectedServices.some(item => item.id === -1)
        ? null
        : selectedServices,
      reminders: selectedReminders.some(item => item.id === 'all')
        ? null
        : selectedReminders,
      dateRange: selectedDateRange.length === 0
        ? null
        : selectedDateRange,
    }
    if (newFilter.patient == null) delete newFilter.patient;
    if (newFilter.doctors == null) delete newFilter.doctors;
    if (newFilter.users == null) delete newFilter.users;
    if (newFilter.services == null) delete newFilter.services;
    if (newFilter.reminders == null) delete newFilter.reminders;
    if (newFilter.dateRange == null) delete newFilter.dateRange;
    onSubmit?.(newFilter);
    handleCloseFilters();
  };

  const handleDoctorChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1]
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedDoctors(initialState.selectedDoctors));
      return;
    }
    const newDoctors = doctors.filter((doctor) =>
      newValue.some(item => item === doctor.id)
    );
    localDispatch(setSelectedDoctors(newDoctors.filter(doctor => doctor.id !== -1)));
  };

  const handleServicesChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedServices(initialState.selectedServices));
      return;
    }
    const newServices = services.filter((service) =>
      newValue.some(item => item === service.id)
    );
    localDispatch(setSelectedServices(newServices.filter(service => service.id !== -1)));
  };

  const handleCloseRangePicker = (event) => {
    event?.stopPropagation()
    localDispatch(setShowRangePicker(false));
  }

  const handleOpenRangePicker = (event) => {
    event?.stopPropagation();
    localDispatch(setShowRangePicker(true));
  }

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    localDispatch(setDateRange([startDate, endDate]));
  };

  const handleRemindersChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === 'all') {
      localDispatch(setSelectedReminders(initialState.selectedReminders));
      return;
    }
    const newReminders = reminderOptions.filter((reminder) =>
      newValue.some(item => item === reminder.id)
    );
    localDispatch(setSelectedReminders(newReminders.filter(reminder => reminder.id !== 'all')));
  };

  const handleUsersChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1]
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedUsers(initialState.selectedUsers));
      return;
    }
    const newUsers = users.filter((user) =>
      newValue.some(item => item === user.id)
    );
    localDispatch(setSelectedUsers(newUsers.filter(user => user.id !== -1)));
  };

  const handleShortcutSelected = (shortcut) => {
    onShortcutSelected?.(shortcut.id);
    handleCloseFilters();
  };

  const isShortcutSelected = (shortcut) => {
    return (selectedShortcut || 'all') === shortcut;
  };

  return (
    <div
      className={styles.filterBackdrop}
      onClick={handleCloseFilters}
    >
      <Paper
        className={styles.crmFilters}
        onClick={handleCloseRangePicker}
      >
        <div className={styles.titleContainer}>
          <Typography className={styles.title}>
            {textForKey('Filter')}
          </Typography>
          <IconButton className={styles.closeButton} onClick={handleCloseFilters}>
            <IconClose/>
          </IconButton>
        </div>
        <div className={styles.container}>
          <div className={styles.dataContainer}>
            <div className={styles.shortcuts}>
              {Shortcuts.map((item) => (
                <div
                  key={item.id}
                  className={clsx(styles.shortcut, { [styles.selected]: isShortcutSelected(item.id) })}
                  onClick={() => handleShortcutSelected(item)}
                >
                  <Typography className={styles.label}>{item.name}</Typography>
                </div>
              ))}
            </div>
            <div className={styles.filters}>
              <div className={styles.fieldsContainer}>
                <EASTextField
                  readOnly
                  ref={pickerRef}
                  value={dateRangeText}
                  placeholder="01.01.2021 - 30.01.2021"
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
                  rootClass={styles.simpleField}
                  label={textForKey('Doctors')}
                  labelId="doctors-select-label"
                  options={doctors}
                  defaultOption={{
                    id: -1,
                    name: textForKey('All doctors')
                  }}
                  value={selectedDoctors?.map(item => item.id) || []}
                  onChange={handleDoctorChange}
                />

                <EASSelect
                  multiple
                  rootClass={styles.simpleField}
                  label={textForKey('Responsible')}
                  labelId="doctors-select-label"
                  options={users}
                  defaultOption={{
                    id: -1,
                    name: textForKey('All users')
                  }}
                  value={selectedUsers?.map(item => item.id) || []}
                  onChange={handleUsersChange}
                />

                <EASSelect
                  multiple
                  rootClass={styles.simpleField}
                  label={textForKey('Services')}
                  labelId="doctors-select-label"
                  options={services}
                  defaultOption={{
                    id: -1,
                    name: textForKey('All services')
                  }}
                  value={selectedServices?.map(item => item.id) || []}
                  onChange={handleServicesChange}
                />

                <EASSelect
                  multiple
                  rootClass={styles.simpleField}
                  label={textForKey('crm_reminders')}
                  labelId="doctors-select-label"
                  options={reminderOptions}
                  value={selectedReminders?.map(item => item.id) || []}
                  onChange={handleRemindersChange}
                />
              </div>
              <div className={styles.footer}>
                <Button onClick={handleCloseFilters}>
                  {textForKey('Close')}
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
    </div>
  )
};

export default CrmFilters;

CrmFilters.propTypes = {
  selectedShortcut: PropTypes.string,
  onShortcutSelected: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
}
