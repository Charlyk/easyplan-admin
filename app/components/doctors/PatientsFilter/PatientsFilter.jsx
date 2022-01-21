import React, { useMemo, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { Calendar } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';
import { useSelector, useDispatch } from 'react-redux';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import { Statuses } from 'app/utils/constants';
import { getAppLanguage, textForKey } from 'app/utils/localization';

import {
  clinicServicesSelector,
  userClinicSelector,
} from 'redux/selectors/appDataSelector';
import { openAppointmentModal } from 'redux/slices/createAppointmentModalSlice';
import styles from './PatientsFilter.module.scss';

const PatientsFilter = ({
  filterData,
  selectedDate,
  viewMode,
  onNameChange,
  onServiceChange,
  onStatusChange,
  onDateChange,
  onViewModeChange,
}) => {
  const services = useSelector(clinicServicesSelector);
  const userClinic = useSelector(userClinicSelector);
  const dispatch = useDispatch();
  const sortedServices = useMemo(() => {
    return sortBy(services, (item) => item.name.toLowerCase());
  }, [services]);

  const handleOnClick = () => {
    dispatch(
      openAppointmentModal({
        open: true,
        isDoctorMode: true,
        doctor: { ...userClinic, id: userClinic.userId },
      }),
    );
  };

  useEffect(() => {
    if (userClinic.canCreateSchedules) return;
    dispatch(openAppointmentModal({ open: false }));
  }, [userClinic.canCreateSchedules]);

  return (
    <div className={styles.patientsFilter}>
      <ToggleButtonGroup
        exclusive
        value={viewMode}
        onChange={onViewModeChange}
        style={{ marginBottom: '5px' }}
      >
        <ToggleButton
          value='week'
          classes={{ root: styles.tabRoot, selected: styles.tabSelected }}
        >
          <Typography className={styles.tabsLabel}>
            {textForKey('Week schedules')}
          </Typography>
        </ToggleButton>
        <ToggleButton
          value='day'
          classes={{ root: styles.tabRoot, selected: styles.tabSelected }}
        >
          <Typography className={styles.tabsLabel}>
            {textForKey('Day schedules')}
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>

      {userClinic.canCreateSchedules && (
        <Button
          variant='outlined'
          className={styles.schedulesBtn}
          onClick={handleOnClick}
        >
          {textForKey('add appointment')}
        </Button>
      )}

      <EASTextField
        type='text'
        value={filterData?.searchQuery || ''}
        containerClass={styles.simpleField}
        fieldLabel={textForKey('Patient')}
        onChange={onNameChange}
      />
      <EASSelect
        rootClass={styles.simpleField}
        label={textForKey('Service')}
        labelId='service-select-label'
        value={filterData?.serviceId || -1}
        defaultOption={{
          id: -1,
          name: textForKey('All services'),
        }}
        options={sortedServices}
        onChange={onServiceChange}
      />
      <EASSelect
        label={textForKey('Appointment status')}
        labelId='status-select-label'
        value={filterData.appointmentStatus ?? 'all'}
        rootClass={styles.simpleField}
        defaultOption={{
          id: 'all',
          name: textForKey('All statuses'),
        }}
        options={Statuses}
        onChange={onStatusChange}
      />

      <Calendar
        locale={locales[getAppLanguage()]}
        onChange={onDateChange}
        date={selectedDate}
      />
    </div>
  );
};

export default React.memo(PatientsFilter, areComponentPropsEqual);

PatientsFilter.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  viewMode: PropTypes.oneOf(['day', 'week']),
  filterData: PropTypes.shape({
    patientName: PropTypes.string,
    serviceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    appointmentStatus: PropTypes.string,
  }),
  onNameChange: PropTypes.func,
  onDateChange: PropTypes.func,
  onServiceChange: PropTypes.func,
  onStatusChange: PropTypes.func,
  onViewModeChange: PropTypes.func,
};

PatientsFilter.defaultProps = {
  onDateChange: () => null,
  onNameChange: () => null,
  onViewModeChange: () => null,
  onServiceChange: () => null,
  onStatusChange: () => null,
  selectedDate: new Date(),
};
