import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import dynamic from 'next/dynamic';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import isEqual from "lodash/isEqual";
import sum from 'lodash/sum';
import sortBy from "lodash/sortBy";
import moment from 'moment-timezone';
import Form from 'react-bootstrap/Form';
import { useRouter } from "next/router";

import IconList from "../../../icons/iconList";
import { textForKey } from '../../../../../utils/localization';
import formattedAmount from "../../../../../utils/formattedAmount";
import { Role } from "../../../../utils/constants";
import StatisticFilter from '../StatisticFilter';
import reducer, {
  initialState,
  setSelectedDoctor,
  setSelectedService,
  setDateRange,
  setShowRangePicker,
  setInitialQuery,
  setServicesModal,
} from "./DoctorsAnalytics.reducer";
import styles from './DoctorsAnalytics.module.scss';
import ServicesListModal from "./ServicesListModal";
import ListItemText from "@material-ui/core/ListItemText";
import EASSelect from "../../../common/EASSelect";
import EASTextField from "../../../common/EASTextField";

const EasyDateRangePicker = dynamic(() => import('../../../common/EasyDateRangePicker'));

const DoctorsAnalytics = ({ currentClinic, statistics, query: initialQuery }) => {
  const pickerRef = useRef(null);
  const router = useRouter();
  const currency = currentClinic.currency;
  const [
    {
      isLoading,
      selectedDoctor,
      selectedService,
      showRangePicker,
      servicesModal,
      dateRange: [startDate, endDate],
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const doctors = useMemo(() => {
    return sortBy(
      currentClinic.users.filter(user => user.roleInClinic === Role.doctor),
      user => user.fullName.toLowerCase(),
    ).map(doctor => ({
      id: doctor.id,
      name: `${doctor.firstName} ${doctor.lastName} ${doctor.isHidden ? `(${textForKey('Fired')})` : ''}`
    }))
  }, [currentClinic]);

  const services = useMemo(() => {
    return sortBy(currentClinic.services, service => service.name.toLowerCase())
  }, [currentClinic]);

  useEffect(() => {
    localDispatch(setInitialQuery(initialQuery));
  }, []);

  const handleServiceChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(setSelectedService({ id: newValue }));
      return;
    }
    const service = services.find((item) => item.id === newValue);
    localDispatch(setSelectedService(service));
  };

  const handleDoctorChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(setSelectedDoctor({ id: newValue }));
      return;
    }
    const doctor = doctors.find((item) => item.id === newValue);
    localDispatch(setSelectedDoctor(doctor));
  };

  const handleDatePickerOpen = () => {
    localDispatch(setShowRangePicker(true));
  };

  const handleDatePickerClose = () => {
    localDispatch(setShowRangePicker(false));
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    localDispatch(
      setDateRange([
        startDate,
        moment(endDate).endOf('day').toDate(),
      ]),
    );
  };

  const handleFilterSubmit = () => {
    const query = {
      fromDate: moment(startDate).format('YYYY-MM-DD'),
      toDate: moment(endDate).format('YYYY-MM-DD'),
    }

    if (selectedDoctor.id !== -1) {
      query.doctorId = selectedDoctor.id;
    }

    if (selectedService.id !== -1) {
      query.serviceId = selectedService.id;
    }

    if (isEqual(query, initialQuery)) {
      return;
    }

    const queryString = new URLSearchParams(query).toString();
    router.replace(`/analytics/doctors?${queryString}`);
  };

  const handleShowServices = (statistic) => {
    localDispatch(
      setServicesModal({
        open: true,
        statistic: statistic,
      })
    );
  };

  const handleCloseServicesModal = () => {
    localDispatch(setServicesModal({ open: false }));
  };

  return (
    <div className={styles['statistics-doctors']}>
      <ServicesListModal
        {...servicesModal}
        currency={currency}
        onClose={handleCloseServicesModal}
      />
      <StatisticFilter isLoading={isLoading} onUpdate={handleFilterSubmit}>
        <EASSelect
          rootClass={styles.selectRoot}
          label={textForKey('Services')}
          options={services}
          value={selectedService?.id ?? -1}
          labelId='services-select-label'
          defaultOption={{
            id: -1,
            name: textForKey('All services')
          }}
          onChange={handleServiceChange}
        />

        <EASSelect
          rootClass={styles.selectRoot}
          label={textForKey('Doctors')}
          options={doctors}
          value={selectedDoctor?.id ?? -1}
          labelId='doctors-select-label'
          defaultOption={{
            id: -1,
            name: textForKey('All doctors')
          }}
          onChange={handleDoctorChange}
        />

        <EASTextField
          ref={pickerRef}
          containerClass={styles.selectRoot}
          fieldLabel={textForKey('Period')}
          readOnly
          onPointerUp={handleDatePickerOpen}
          value={`${moment(startDate).format('DD MMM YYYY')} - ${moment(
            endDate,
          ).format('DD MMM YYYY')}`}
        />
      </StatisticFilter>
      <div className={styles['data-container']}>
        {!isLoading && statistics?.length === 0 && (
          <span className={styles['no-data-label']}>{textForKey('No results')}</span>
        )}
        {statistics?.length > 0 && (
          <TableContainer classes={{ root: styles['table-container'] }}>
            <Table classes={{ root: styles['data-table'] }}>
              <TableHead>
                <TableRow>
                  <TableCell>{textForKey('Doctor')}</TableCell>
                  <TableCell align="right">{textForKey('Total income')}</TableCell>
                  <TableCell align="right">{textForKey('Doctor part')}</TableCell>
                  <TableCell align="right">{textForKey('Clinic profit')}</TableCell>
                  <TableCell align="right" size="small">{textForKey('Services')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statistics.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.doctor.fullName}</TableCell>
                    <TableCell align="right">
                      {formattedAmount(item.totalAmount, currentClinic.currency)}
                    </TableCell>
                    <TableCell align="right">
                      {formattedAmount(item.doctorAmount, currentClinic.currency)}
                    </TableCell>
                    <TableCell align="right">
                      {formattedAmount(item.clinicAmount, currentClinic.currency)}
                    </TableCell>
                    <TableCell align="right" size="small">
                      <IconButton
                        className={styles.servicesButton}
                        onPointerUp={() => handleShowServices(item)}
                      >
                        <IconList fill="#3A83DC"/>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell/>
                  <TableCell/>
                  <TableCell/>
                  <TableCell align='right'>
                    {textForKey('Total')}:{' '}
                    {formattedAmount(sum(statistics.map((it) => it.clinicAmount)), currentClinic.currency)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </div>
      <EasyDateRangePicker
        onChange={handleDateChange}
        onClose={handleDatePickerClose}
        dateRange={{ startDate, endDate }}
        open={showRangePicker}
        pickerAnchor={pickerRef.current}
      />
    </div>
  );
};

export default DoctorsAnalytics;
