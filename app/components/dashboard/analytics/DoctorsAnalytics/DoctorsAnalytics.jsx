import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import sum from 'lodash/sum';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useTranslate } from 'react-polyglot';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import IconList from 'app/components/icons/iconList';
import { Role } from 'app/utils/constants';
import formattedAmount from 'app/utils/formattedAmount';
import styles from './DoctorsAnalytics.module.scss';
import reducer, {
  initialState,
  setSelectedDoctor,
  setSelectedService,
  setDateRange,
  setShowRangePicker,
  setInitialQuery,
  setServicesModal,
} from './DoctorsAnalytics.reducer';

const EasyDateRangePicker = dynamic(() =>
  import('app/components/common/EasyDateRangePicker'),
);
const StatisticFilter = dynamic(() => import('../StatisticFilter'));
const ServicesListModal = dynamic(() => import('./ServicesListModal'));

const DoctorsAnalytics = ({
  currentClinic,
  statistics,
  query: initialQuery,
}) => {
  const textForKey = useTranslate();
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
      currentClinic.users.filter((user) => user.roleInClinic === Role.doctor),
      (user) => user.fullName.toLowerCase(),
    ).map((doctor) => ({
      id: doctor.id,
      name: `${doctor.firstName} ${doctor.lastName} ${
        doctor.isHidden ? `(${textForKey('fired')})` : ''
      }`,
    }));
  }, [currentClinic]);

  const services = useMemo(() => {
    return sortBy(currentClinic.services, (service) =>
      service.name.toLowerCase(),
    );
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
      setDateRange([startDate, moment(endDate).endOf('day').toDate()]),
    );
  };

  const handleFilterSubmit = () => {
    const query = {
      fromDate: moment(startDate).format('YYYY-MM-DD'),
      toDate: moment(endDate).format('YYYY-MM-DD'),
    };

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
      }),
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
          label={textForKey('services')}
          options={services}
          value={selectedService?.id ?? -1}
          labelId='services-select-label'
          defaultOption={{
            id: -1,
            name: textForKey('all services'),
          }}
          onChange={handleServiceChange}
        />

        <EASSelect
          rootClass={styles.selectRoot}
          label={textForKey('doctors')}
          options={doctors}
          value={selectedDoctor?.id ?? -1}
          labelId='doctors-select-label'
          defaultOption={{
            id: -1,
            name: textForKey('all doctors'),
          }}
          onChange={handleDoctorChange}
        />

        <EASTextField
          ref={pickerRef}
          containerClass={styles.selectRoot}
          fieldLabel={textForKey('period')}
          readOnly
          onPointerUp={handleDatePickerOpen}
          value={`${moment(startDate).format('DD MMM YYYY')} - ${moment(
            endDate,
          ).format('DD MMM YYYY')}`}
        />
      </StatisticFilter>
      <div className={styles['data-container']}>
        {!isLoading && statistics?.length === 0 && (
          <span className={styles['no-data-label']}>
            {textForKey('no results')}
          </span>
        )}
        {statistics?.length > 0 && (
          <TableContainer classes={{ root: styles['table-container'] }}>
            <Table classes={{ root: styles['data-table'] }}>
              <TableHead>
                <TableRow>
                  <TableCell>{textForKey('doctor')}</TableCell>
                  <TableCell align='right'>
                    {textForKey('total income')}
                  </TableCell>
                  <TableCell align='right'>
                    {textForKey('doctor part')}
                  </TableCell>
                  <TableCell align='right'>
                    {textForKey('clinic profit')}
                  </TableCell>
                  <TableCell align='right' size='small'>
                    {textForKey('services')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statistics.map((item) => (
                  <TableRow key={item.doctor.id}>
                    <TableCell>{item.doctor.fullName}</TableCell>
                    <TableCell align='right'>
                      {formattedAmount(
                        item.totalAmount,
                        currentClinic.currency,
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      {formattedAmount(
                        item.doctorAmount,
                        currentClinic.currency,
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      {formattedAmount(
                        item.clinicAmount,
                        currentClinic.currency,
                      )}
                    </TableCell>
                    <TableCell align='right' size='small'>
                      <IconButton
                        className={styles.servicesButton}
                        onPointerUp={() => handleShowServices(item)}
                      >
                        <IconList fill='#3A83DC' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell align='right'>
                    {textForKey('total')}:{' '}
                    {formattedAmount(
                      sum(statistics.map((it) => it.clinicAmount)),
                      currentClinic.currency,
                    )}
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
