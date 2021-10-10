import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Typography from "@material-ui/core/Typography";
import { Calendar } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';

import { clinicServicesSelector } from '../../../../redux/selectors/clinicSelector';
import { Statuses } from '../../../utils/constants';
import { getAppLanguage, textForKey } from '../../../utils/localization';
import areComponentPropsEqual from "../../../utils/areComponentPropsEqual";
import EASTextField from "../../common/EASTextField";
import EASSelect from "../../common/EASSelect";
import styles from './PatientsFilter.module.scss';

const PatientsFilter = (
  {
    filterData,
    selectedDate,
    currentClinic,
    viewMode,
    onNameChange,
    onServiceChange,
    onStatusChange,
    onDateChange,
    onViewModeChange,
  }
) => {
  const services = clinicServicesSelector(currentClinic);

  const sortedServices = useMemo(() => {
    return sortBy(services, item => item.name.toLowerCase())
  }, [services])

  return (
    <div className={styles.patientsFilter}>
      <ToggleButtonGroup
        exclusive
        value={viewMode}
        onChange={onViewModeChange}
        style={{ marginBottom: '5px' }}
      >
        <ToggleButton value='day' classes={{ root: styles.tabRoot, selected: styles.tabSelected }}>
          <Typography className={styles.tabsLabel}>{textForKey('Week schedules')}</Typography>
        </ToggleButton>
        <ToggleButton value='week' classes={{ root: styles.tabRoot, selected: styles.tabSelected }}>
          <Typography className={styles.tabsLabel}>{textForKey('Day schedules')}</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
      <EASTextField
        type="text"
        value={filterData.patientName || ''}
        containerClass={styles.simpleField}
        fieldLabel={textForKey('Patient')}
        onChange={onNameChange}
      />
      <EASSelect
        rootClass={styles.simpleField}
        label={textForKey('Service')}
        labelId="service-select-label"
        value={filterData.serviceId || -1}
        defaultOption={{
          id: -1,
          name: textForKey('All services')
        }}
        options={sortedServices}
        onChange={onServiceChange}
      />
      <EASSelect
        label={textForKey('Appointment status')}
        labelId="status-select-label"
        value={filterData.appointmentStatus ?? 'all'}
        rootClass={styles.simpleField}
        defaultOption={{
          id: 'all',
          name: textForKey('All statuses')
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