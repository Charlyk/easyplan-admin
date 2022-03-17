import React from 'react';
import PropTypes from 'prop-types';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import ColumnsWrapper from './ColumnsWrapper';
import styles from './EasyCalendar.module.scss';
import Header from './Header';
import HourIndicator from './HourIndicator';
import Hours from './Hours';

const EasyCalendar = ({
  dayHours,
  canMoveColumns,
  columns,
  schedules,
  viewDate,
  hourIndicator,
  showHourIndicator,
  animatedStatuses,
  hideCreateIndicator,
  noDataView,
  onAddSchedule,
  onScheduleSelected,
  onHeaderItemClick,
  onMoveColumnLeft,
  onMoveColumnRight,
}) => {
  return (
    <div className={styles.calendarRoot}>
      <Header
        items={columns}
        canMoveColumns={canMoveColumns}
        onItemClick={onHeaderItemClick}
        onMoveLeft={onMoveColumnLeft}
        onMoveRight={onMoveColumnRight}
      />
      <div className={styles.calendarContainer}>
        {dayHours.length === 0 && (
          <div className={styles.noDataContainer}>{noDataView}</div>
        )}
        <HourIndicator
          disabled={
            !hourIndicator || dayHours.length === 0 || !showHourIndicator
          }
          dayHours={dayHours}
          viewDate={viewDate}
        />
        <Hours hours={dayHours} />
        <ColumnsWrapper
          viewDate={viewDate}
          schedules={schedules}
          hours={dayHours}
          columns={columns}
          hideCreateIndicator={hideCreateIndicator}
          animatedStatuses={animatedStatuses}
          onAddSchedule={onAddSchedule}
          onScheduleSelected={onScheduleSelected}
        />
      </div>
    </div>
  );
};

export default React.memo(EasyCalendar, areComponentPropsEqual);

EasyCalendar.propTypes = {
  hourIndicator: PropTypes.bool,
  canMoveColumns: PropTypes.bool,
  dayHours: PropTypes.arrayOf(PropTypes.string).isRequired,
  viewDate: PropTypes.instanceOf(Date).isRequired,
  showHourIndicator: PropTypes.bool,
  hideCreateIndicator: PropTypes.bool,
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      schedules: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          doctorColor: PropTypes.string,
          comment: PropTypes.string,
          doctorId: PropTypes.number,
          startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          isUrgent: PropTypes.bool,
          urgent: PropTypes.bool,
          patient: PropTypes.shape({
            id: PropTypes.number,
            fullName: PropTypes.string,
          }),
          scheduleStatus: PropTypes.string,
          serviceColor: PropTypes.string,
          serviceCurrency: PropTypes.string,
          serviceId: PropTypes.number,
          serviceName: PropTypes.string,
          servicePrice: PropTypes.number,
          type: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      doctorId: PropTypes.number,
      name: PropTypes.string,
      date: PropTypes.instanceOf(Date),
      disabled: PropTypes.bool,
      hint: PropTypes.string,
      isCabinet: PropTypes.bool,
    }),
  ).isRequired,
  animatedStatuses: PropTypes.arrayOf(
    PropTypes.oneOf([
      'Pending',
      'OnSite',
      'Confirmed',
      'WaitingForPatient',
      'Late',
      'DidNotCome',
      'Canceled',
      'CompletedNotPaid',
      'CompletedPaid',
      'PartialPaid',
      'Paid',
      'Rescheduled',
    ]),
  ),
  noDataView: PropTypes.element,
  onAddSchedule: PropTypes.func,
  onScheduleSelected: PropTypes.func,
  onHeaderItemClick: PropTypes.func,
  onMoveColumnLeft: PropTypes.func,
  onMoveColumnRight: PropTypes.func,
};

EasyCalendar.defaultProps = {
  hourIndicator: true,
  viewDate: new Date(),
  animatedStatuses: [],
  hideCreateIndicator: false,
  showHourIndicator: false,
  onAddSchedule: () => null,
  onScheduleSelected: () => null,
  onHeaderItemClick: () => null,
};
