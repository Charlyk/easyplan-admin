import React, { useEffect, useMemo, useRef } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import EasyDateRangePicker from 'app/components/common/EasyDateRangePicker';
import PatientsSearchField from 'app/components/common/PatientsSearchField/PatientsSearchField';
import IconClose from 'app/components/icons/iconClose';
import { textForKey } from 'app/utils/localization';
import {
  clinicDoctorsSelector,
  clinicManagementUsersSelector,
  clinicServicesSelector,
} from 'redux/selectors/appDataSelector';
import { crmDealsStatesSelector } from 'redux/selectors/crmBoardSelector';
import { DealShortcutType } from 'types';
import {
  defaultRange,
  reminderOptions,
  Shortcuts,
} from './CrmFilters.constants';
import styles from './CrmFilters.module.scss';
import {
  initialState,
  setPatient,
  setSelectedDoctors,
  setSelectedReminder,
  setSelectedServices,
  setSelectedUsers,
  setDateRange,
  setShowRangePicker,
  setSelectedStates,
  resetState,
  dispatchFetchCrmFilter,
  dispatchUpdateCrmFilter,
} from './CrmFilters.reducer';
import { crmFiltersSelector } from './CrmFilters.selector';

const CrmFilters = ({ onSubmit, onClose }) => {
  const dispatch = useDispatch();
  const {
    patient,
    selectedDoctors,
    selectedReminder,
    selectedServices,
    selectedUsers,
    selectedDateRange,
    showRangePicker,
    selectedStates,
    selectedShortcut,
  } = useSelector(crmFiltersSelector);
  const pickerRef = useRef(null);
  const services = useSelector(clinicServicesSelector);
  const dealsStates = useSelector(crmDealsStatesSelector);
  const clinicDoctors = useSelector(clinicDoctorsSelector);
  const clinicUsers = useSelector(clinicManagementUsersSelector);

  const doctors = useMemo(() => {
    return clinicDoctors.map((item) => ({
      ...item,
      name: item.fullName,
    }));
  }, [clinicDoctors]);

  const users = useMemo(() => {
    return clinicUsers.map((item) => ({
      ...item,
      name: item.fullName,
    }));
  }, [clinicUsers]);

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
    dispatch(dispatchFetchCrmFilter());
  }, []);

  const handlePatientChange = (selectedPatient) => {
    dispatch(setPatient(selectedPatient));
  };

  const handleCloseFilters = () => {
    onClose?.();
  };

  const handleResetFilters = () => {
    dispatch(resetState(dealsStates));
  };

  const getNewFilter = (shortcut = selectedShortcut) => ({
    startDate: selectedDateRange.length === 2 ? selectedDateRange[0] : null,
    endDate: selectedDateRange.length === 2 ? selectedDateRange[1] : null,
    patientId: patient ? patient.id : null,
    states: selectedStates.map((state) => state.id),
    doctors: selectedDoctors.some((item) => item.id === -1)
      ? []
      : selectedDoctors.map((doctor) => doctor.id),
    responsible: selectedUsers.some((item) => item.id === -1)
      ? []
      : selectedUsers.map((user) => user.id),
    services: selectedServices.some((item) => item.id === -1)
      ? []
      : selectedServices.map((service) => service.id),
    reminder: selectedReminder.id,
    shortcut: shortcut.id,
  });

  const handleSubmitFilter = () => {
    const newFilter = getNewFilter();
    dispatch(dispatchUpdateCrmFilter(newFilter));
    onSubmit?.();
  };

  const handleDoctorChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      dispatch(setSelectedDoctors(initialState.selectedDoctors));
      return;
    }
    const newDoctors = doctors.filter((doctor) =>
      newValue.some((item) => item === doctor.id),
    );
    dispatch(
      setSelectedDoctors(newDoctors.filter((doctor) => doctor.id !== -1)),
    );
  };

  const handleStatesChanged = (event) => {
    const newValue = event.target.value;
    if (newValue.length === 0) {
      dispatch(
        setSelectedStates(dealsStates.filter((item) => item.visibleByDefault)),
      );
      return;
    }
    const newStates = dealsStates.filter((state) =>
      newValue.some((item) => item === state.id),
    );
    dispatch(setSelectedStates(newStates.filter((state) => state.id !== -1)));
  };

  const handleServicesChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      dispatch(setSelectedServices(initialState.selectedServices));
      return;
    }
    const newServices = services.filter((service) =>
      newValue.some((item) => item === service.id),
    );
    dispatch(
      setSelectedServices(newServices.filter((service) => service.id !== -1)),
    );
  };

  const handleCloseRangePicker = (event) => {
    event?.stopPropagation();
    dispatch(setShowRangePicker(false));
  };

  const handleOpenRangePicker = (event) => {
    event?.stopPropagation();
    dispatch(setShowRangePicker(true));
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    dispatch(setDateRange([startDate, endDate]));
  };

  const handleRemindersChange = (event) => {
    const newValue = event.target.value;
    if (newValue === 0) {
      dispatch(setSelectedReminder(null));
      return;
    }
    const newReminder = reminderOptions.find(
      (reminder) => newValue === reminder.id,
    );
    dispatch(setSelectedReminder(newReminder));
  };

  const handleUsersChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      dispatch(setSelectedUsers(initialState.selectedUsers));
      return;
    }
    const newUsers = users.filter((user) =>
      newValue.some((item) => item === user.id),
    );
    dispatch(setSelectedUsers(newUsers.filter((user) => user.id !== -1)));
  };

  const handleShortcutSelected = (shortcut) => {
    const newFilter = getNewFilter(shortcut);
    dispatch(dispatchUpdateCrmFilter(newFilter));
    onClose?.();
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
                        [styles.expired]:
                          item.id === DealShortcutType.ExpiredTasks,
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
                  canCreate={false}
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
