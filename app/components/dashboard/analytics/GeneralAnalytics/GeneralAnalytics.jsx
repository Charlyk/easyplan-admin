import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import clsx from 'clsx';
import sortBy from 'lodash/sortBy';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import IconCheckMark from 'app/components/icons/iconCheckMark';
import IconClock from 'app/components/icons/iconClock';
import IconCreditCard from 'app/components/icons/iconCreditCard';
import IconLiabilities from 'app/components/icons/iconLiabilities';
import IconSuccess from 'app/components/icons/iconSuccess';
import IconXPerson from 'app/components/icons/iconXPerson';
import { Role, Statuses } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import styles from './GeneralAnalytics.module.scss';
import { reducer, actions, initialState } from './GeneralAnalytics.reducer';

const EasyDateRangePicker = dynamic(() =>
  import('app/components/common/EasyDateRangePicker'),
);
const StatisticFilter = dynamic(() => import('../StatisticFilter'));
const IncomeStatisticItem = dynamic(() => import('./IncomeStatisticItem'));
const StatusItem = dynamic(() => import('./StatusItem'));

const General = ({
  currentClinic,
  currentUser,
  scheduleStats,
  financeStats,
  query: initialQuery,
}) => {
  const pickerRef = useRef(null);
  const userClinic = currentUser.clinics.find(
    (item) => item.clinicId === currentClinic.id,
  );
  const isAdmin = userClinic?.roleInClinic === Role.admin;
  const doctors = useMemo(() => {
    return sortBy(
      currentClinic?.users?.filter(
        (user) => user.roleInClinic === Role.doctor,
      ) || [],
      (user) => user.fullName.toLowerCase(),
    ).map(({ id, fullName, isHidden }) => ({
      id,
      name: `${fullName} ${isHidden ? `(${textForKey('Fired')})` : ''}`,
    }));
  }, [currentClinic]);
  const [{ selectedDoctor, showRangePicker, selectedRange }, localDispatch] =
    useReducer(reducer, initialState);
  const router = useRouter();
  const [startDate, endDate] = selectedRange;

  useEffect(() => {
    localDispatch(actions.setInitialQuery(initialQuery));
  }, []);

  const handleDoctorChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (newValue === -1) {
      localDispatch(actions.setSelectedDoctor({ id: newValue }));
    } else {
      localDispatch(
        actions.setSelectedDoctor(doctors.find((item) => item.id === newValue)),
      );
    }
  };

  const handleFilterSubmit = async () => {
    const params = {
      fromDate: moment(startDate).format('YYYY-MM-DD'),
      toDate: moment(endDate).format('YYYY-MM-DD'),
    };
    if (selectedDoctor.id !== -1) {
      params.doctorId = selectedDoctor.id;
    }
    const queryString = new URLSearchParams(params).toString();
    router.replace(`/analytics/general?${queryString}`);
  };

  const statuses = scheduleStats?.items || [];

  const getSchedulePercentage = (item) => {
    const percent = (item.count / scheduleStats.total) * 100;
    return Number.isNaN(percent) ? 0 : percent;
  };

  const handleDatePickerClose = () => {
    localDispatch(actions.setShowRangePicker(false));
  };

  const handleDatePickerOpen = () => {
    localDispatch(actions.setShowRangePicker(true));
  };

  const handleDateChange = (data) => {
    const { startDate, endDate } = data.range1;
    localDispatch(actions.setSelectedRange([startDate, endDate]));
  };

  const titleForStatus = (statusItem) => {
    const data = Statuses.find((it) => it.id === statusItem.status);
    return data?.name;
  };

  const iconForStatus = (statusItem) => {
    const data = Statuses.find((it) => it.id === statusItem.status);
    return data?.icon;
  };

  return (
    <div className={styles['general-statistics']} id='general-statistics'>
      <div
        className={clsx(
          styles['main-data-container'],
          !isAdmin && styles.fullWidth,
        )}
      >
        <StatisticFilter onUpdate={handleFilterSubmit}>
          <EASSelect
            rootClass={styles.filterField}
            label={textForKey('Doctor')}
            value={selectedDoctor?.id || -1}
            options={doctors}
            labelId='doctor-select-label'
            defaultOption={{
              id: -1,
              name: textForKey('All doctors'),
            }}
            onChange={handleDoctorChange}
          />

          <EASTextField
            ref={pickerRef}
            containerClass={styles.filterField}
            fieldLabel={textForKey('Period')}
            readOnly
            onPointerUp={handleDatePickerOpen}
            value={`${moment(startDate).format('DD MMM YYYY')} - ${moment(
              endDate,
            ).format('DD MMM YYYY')}`}
          />
        </StatisticFilter>
        <span className={styles['block-title']}>
          {textForKey('Schedules statistics')}
        </span>
        {statuses.length > 0 ? (
          <div className={styles['statuses-container']}>
            {statuses.map((item) => (
              <StatusItem
                status={item}
                personsCount={item.count}
                key={item.status}
                doctorId={selectedDoctor.id}
                startDate={startDate}
                endDate={endDate}
                title={titleForStatus(item)}
                percentage={getSchedulePercentage(item)}
                icon={iconForStatus(item)}
              />
            ))}
          </div>
        ) : null}
      </div>
      {isAdmin && (
        <div className={styles['right-content-wrapper']}>
          {financeStats != null && (
            <div className={styles['items-wrapper']}>
              <IncomeStatisticItem
                title={textForKey('Expectations')}
                icon={<IconClock />}
                amount={financeStats?.expectations.amount}
                persons={financeStats?.expectations.persons}
              />
              <IncomeStatisticItem
                title={textForKey('Confirmed')}
                icon={<IconCheckMark />}
                amount={financeStats?.confirmed.amount}
                persons={financeStats?.confirmed.persons}
              />
              <IncomeStatisticItem
                title={textForKey('Did not came')}
                icon={<IconXPerson />}
                amount={financeStats?.canceled.amount}
                persons={financeStats?.canceled.persons}
              />
              <IncomeStatisticItem
                title={textForKey('Finished')}
                icon={<IconSuccess fill='#ffffff' />}
                amount={financeStats?.finished.amount}
                persons={financeStats?.finished.persons}
              />
              <IncomeStatisticItem
                title={textForKey('Liabilities')}
                icon={<IconLiabilities />}
                amount={financeStats?.debts.amount}
                persons={financeStats?.debts.persons}
              />
              <IncomeStatisticItem
                title={textForKey('Paid')}
                icon={<IconCreditCard />}
                amount={financeStats?.paid.amount}
                persons={financeStats?.paid.persons}
              />
            </div>
          )}
        </div>
      )}
      <EasyDateRangePicker
        open={showRangePicker}
        onChange={handleDateChange}
        onClose={handleDatePickerClose}
        pickerAnchor={pickerRef.current}
        dateRange={{ startDate, endDate }}
      />
    </div>
  );
};

export default General;
