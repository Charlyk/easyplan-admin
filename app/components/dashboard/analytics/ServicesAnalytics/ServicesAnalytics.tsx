import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import { Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconReminders from '@material-ui/icons/NotificationsActiveOutlined';
import axios from 'axios';
import isEqual from 'lodash/isEqual';
import orderBy from 'lodash/orderBy';
import sortBy from 'lodash/sortBy';
import moment, { now } from 'moment-timezone';
import { useRouter } from 'next/router';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import EasyDateRangePicker from 'app/components/common/EasyDateRangePicker';
import { HeaderKeys, Role, ScheduleStatuses } from 'app/utils/constants';
import { baseApiUrl } from 'eas.config';
import {
  authTokenSelector,
  currentClinicSelector,
} from 'redux/selectors/appDataSelector';
import { openCreateReminderModal } from 'redux/slices/CreateReminderModal.reducer';
import { setPatientDetails } from 'redux/slices/mainReduxSlice';
import { ServicesStatisticResponse } from 'types';
import StatisticFilter from '../StatisticFilter';
import styles from './ServicesAnalytics.module.scss';
import reducer, {
  initialState,
  setSelectedDoctors,
  setSelectedServices,
  setSelectedStatuses,
  setDateRange,
  setDoctors,
  setInitialQuery,
  setPage,
  setRowsPerPage,
  setServices,
  setShowRangePicker,
} from './ServicesAnalytics.reducer';

interface ServicesAnalyticsQuery {
  page: string | number;
  rowsPerPage: string | number;
  statuses?: string;
  doctorsId?: string;
  servicesId?: string;
  fromDate: string;
  toDate: string;
}

interface ServicesAnalyticsProps {
  statistics: ServicesStatisticResponse;
  query: ServicesAnalyticsQuery;
}

const ServicesAnalytics: React.FC<ServicesAnalyticsProps> = ({
  statistics: { data: statistics, total: totalItems },
  query: initialQuery,
}) => {
  const textForKey = useTranslate();
  const router = useRouter();
  const dispatch = useDispatch();
  const pickerRef = useRef(null);
  const currentClinic = useSelector(currentClinicSelector);
  const authToken = useSelector(authTokenSelector);
  const doctors = useMemo(() => {
    return orderBy(
      currentClinic.users.filter((user) => user.roleInClinic === Role.doctor),
      ['isHidden', 'fullName'],
      ['asc', 'asc'],
    ).map(({ id, fullName, isHidden }) => ({
      id,
      name: `${fullName} ${isHidden ? `(${textForKey('fired')})` : ''}`,
    }));
  }, [currentClinic]);
  const services = sortBy(currentClinic.services, (service) =>
    service.name.toLowerCase(),
  );

  const [
    {
      isLoading,
      showRangePicker,
      selectedDoctors,
      selectedServices,
      selectedStatuses,
      dateRange: [startDate, endDate],
      page,
      rowsPerPage,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    localDispatch(setInitialQuery(initialQuery));
    if (initialQuery?.servicesId) {
      const serviceArr = initialQuery.servicesId
        .split(',')
        .map((serviceId) => Number(serviceId));
      handleServiceChange(serviceArr);
    }
    if (initialQuery?.doctorsId) {
      const doctorsArr = initialQuery.doctorsId
        .split(',')
        .map((doctorId) => Number(doctorId));
      handleDoctorChange(doctorsArr);
    }
    if (initialQuery?.statuses) {
      const statusesArr = initialQuery.statuses.split(',');
      handleStatusChange(statusesArr);
    }
  }, []);

  useEffect(() => {
    if (currentClinic == null) {
      return;
    }
    const doctors = currentClinic.users.filter(
      (user) => user.roleInClinic === Role.doctor,
    );
    localDispatch(setDoctors(doctors));
    localDispatch(setServices(currentClinic.services));
  }, [currentClinic]);

  const handleFilterUpdated = async (p = page, rp = rowsPerPage) => {
    const query: Record<string, string> = {
      page: String(p),
      rowsPerPage: String(rp),
      fromDate: moment(startDate).format('YYYY-MM-DD'),
      toDate: moment(endDate).format('YYYY-MM-DD'),
      statuses: selectedStatuses.map((status) => status.id).join(','),
    };

    if (!selectedDoctors.some((doctor) => doctor.id === -1)) {
      query.doctorsId = selectedDoctors.map((doctor) => doctor.id).join(',');
    }

    if (!selectedServices.some((services) => services.id === -1)) {
      query.servicesId = selectedServices
        .map((service) => service.id)
        .join(',');
    }

    if (isEqual(query, initialQuery)) {
      return;
    }

    const queryString = new URLSearchParams(query).toString();
    await router.replace(`/reports/services?${queryString}`);
  };

  const handleFilterSubmit = async () => {
    await handleFilterUpdated(0);
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

  const handleDoctorChange = (doctor) => {
    const newValue = doctor;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedDoctors([{ id: -1 }]));
      return;
    }
    const newDoctors = doctors.filter((doctor) =>
      newValue.some((item) => item === doctor.id),
    );
    localDispatch(
      setSelectedDoctors(newDoctors.filter((doctor) => doctor.id !== -1)),
    );
  };

  const handleServiceChange = (service) => {
    const newValue = service;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedServices([{ id: -1 }]));
      return;
    }
    const newServices = services.filter((service) =>
      newValue.some((item) => item === service.id),
    );
    localDispatch(
      setSelectedServices(newServices.filter((service) => service.id !== -1)),
    );
  };

  const handleStatusChange = (status) => {
    const newValue = status;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === 'All') {
      localDispatch(setSelectedStatuses([{ id: 'All' }]));
      return;
    }
    const newStatuses = ScheduleStatuses.filter((status) =>
      newValue.some((item) => item === status.id),
    );
    localDispatch(
      setSelectedStatuses(newStatuses.filter((status) => status.id !== 'All')),
    );
  };

  const titleForStatus = (status) => {
    const data = ScheduleStatuses.find((it) => it.id === status);
    return textForKey(data?.name).toLowerCase();
  };

  const colorForStatus = (status) => {
    const data = ScheduleStatuses.find((it) => it.id === status);
    return data?.color;
  };

  const handleChangePage = async (event, newPage) => {
    localDispatch(setPage(newPage));
    await handleFilterUpdated(newPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const rows = parseInt(event.target.value);
    localDispatch(setRowsPerPage(rows));
    await handleFilterUpdated(page, rows);
  };

  const handlePatientClick = (patientId) => () => {
    dispatch(
      setPatientDetails({
        show: true,
        patientId,
        canDelete: false,
      }),
    );
  };

  const handleCreateReminder = (statisticItem) => {
    dispatch(
      openCreateReminderModal({ deal: statisticItem, searchType: 'Schedule' }),
    );
  };

  const handleDownloadFile = () => {
    const fromDate = moment(startDate).format('YYYY-MM-DD');
    const toDate = moment(endDate).format('YYYY-MM-DD');

    const statuses = selectedStatuses[0].id
      ? selectedStatuses
          ?.map((status) => `statuses=${status.id ?? 'all'}`)
          ?.join('&')
      : null;

    axios
      .get(
        `${baseApiUrl}/reports/services/download?fromDate=${fromDate}&toDate=${toDate}${
          statuses ? `&${statuses}` : ''
        }`,
        {
          headers: {
            [HeaderKeys.authorization]: String(authToken),
            [HeaderKeys.clinicId]: String(currentClinic.id),
          },
          responseType: 'blob',
        },
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <div className={styles['statistics-services']}>
      <StatisticFilter onUpdate={handleFilterSubmit} isLoading={isLoading}>
        <EASSelect
          multiple
          checkable
          rootClass={styles.selectControlRoot}
          label={textForKey('services')}
          labelId='services-select-label'
          options={services}
          value={selectedServices.map((item) => item.id)}
          defaultOption={{
            id: -1,
            name: textForKey('all services'),
          }}
          onChange={(evt) => handleServiceChange(evt.target.value)}
        />
        <EASSelect
          multiple
          checkable
          rootClass={styles.selectControlRoot}
          label={textForKey('doctors')}
          labelId='doctors-select-label'
          options={doctors}
          value={selectedDoctors.map((item) => item.id)}
          defaultOption={{
            id: -1,
            name: textForKey('all doctors'),
          }}
          onChange={(evt) => handleDoctorChange(evt.target.value)}
        />
        <EASTextField
          ref={pickerRef}
          containerClass={styles.selectControlRoot}
          fieldLabel={textForKey('period')}
          readOnly
          onPointerUp={handleDatePickerOpen}
          value={`${moment(startDate).format('DD MMM YYYY')} - ${moment(
            endDate,
          ).format('DD MMM YYYY')}`}
        />
        <EASSelect
          multiple
          checkable
          rootClass={styles.selectControlRoot}
          label={textForKey('statuses')}
          labelId='statuses-select-label'
          options={ScheduleStatuses}
          value={selectedStatuses.map((item) => item.id)}
          defaultOption={{
            id: 'All',
            name: textForKey('all statuses'),
          }}
          onChange={(evt) => handleStatusChange(evt.target.value)}
        />
      </StatisticFilter>
      <div className={styles['data-container']}>
        {isLoading && statistics.length === 0 && (
          <div className={styles.progressWrapper}>
            <CircularProgress classes={{ root: 'circular-progress-bar' }} />
          </div>
        )}
        {!isLoading && statistics.length === 0 && (
          <span className={styles['no-data-label']}>
            {textForKey('no results')}
          </span>
        )}
        {statistics.length > 0 && (
          <TableContainer classes={{ root: styles['table-container'] }}>
            <Table classes={{ root: styles['data-table'] }}>
              <TableHead>
                <TableRow>
                  <TableCell>{textForKey('date')}</TableCell>
                  <TableCell>{textForKey('doctor')}</TableCell>
                  <TableCell>{textForKey('service')}</TableCell>
                  <TableCell>{textForKey('patient')}</TableCell>
                  <TableCell>{textForKey('phone number')}</TableCell>
                  <TableCell align='right'>{textForKey('status')}</TableCell>
                  <TableCell align='right'>{textForKey('actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statistics.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {moment(item.dateAndTime).format('DD MMM YYYY HH:mm')}
                    </TableCell>
                    <TableCell>{item.doctor}</TableCell>
                    <TableCell>{item.serviceName}</TableCell>
                    <TableCell
                      className={styles['patient-name-label']}
                      onClick={handlePatientClick(item.patientId)}
                    >
                      {item.patient}
                    </TableCell>
                    <TableCell
                      className={styles['patient-name-label']}
                      onClick={handlePatientClick(item.patientId)}
                    >
                      <a
                        href={`tel:${item.patientPhoneNumber.replace('+', '')}`}
                      >
                        {item.patientPhoneNumber}
                      </a>
                    </TableCell>
                    <TableCell align='right'>
                      <span
                        className={styles['status-label']}
                        style={{
                          color: colorForStatus(item.status),
                          backgroundColor: `${colorForStatus(item.status)}1A`,
                        }}
                      >
                        {titleForStatus(item.status)}
                      </span>
                    </TableCell>
                    <TableCell size='small' align='right'>
                      <Tooltip
                        title={textForKey('crm_add_reminder')}
                        placement='left'
                      >
                        <IconButton
                          disableRipple
                          className={styles.reminderBtn}
                          onClick={() => handleCreateReminder(item)}
                        >
                          <IconReminders />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <div className={styles.pageFooter}>
        <Button
          variant={'text'}
          classes={{
            root: styles.primaryButton,
          }}
          onClick={handleDownloadFile}
        >
          {textForKey('export_excel')}
        </Button>
        <TablePagination
          classes={{ root: styles['table-pagination'] }}
          rowsPerPageOptions={[25, 50, 100]}
          colSpan={4}
          count={totalItems}
          rowsPerPage={parseInt(String(rowsPerPage))}
          labelRowsPerPage={textForKey('rows per page')}
          page={parseInt(String(page))}
          component='div'
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true,
          }}
          onRowsPerPageChange={handleChangeRowsPerPage}
          onPageChange={handleChangePage}
        />
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

export default ServicesAnalytics;
