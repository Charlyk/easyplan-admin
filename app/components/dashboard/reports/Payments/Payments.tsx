import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment-timezone';
import { useTranslate } from 'react-polyglot';
import EASTextField from 'app/components/common/EASTextField';
import EasyDateRangePicker from 'app/components/common/EasyDateRangePicker';
import StatisticFilter from 'app/components/dashboard/analytics/StatisticFilter';
import styles from './Payments.module.scss';

interface PaymentsQuery {
  page: number;
  itemsPerPage: number;
  startDate: string;
  endDate: string;
}

interface PaymentsProps {
  query: PaymentsQuery;
}

const Payments: React.FC<PaymentsProps> = ({ query }) => {
  const textForKey = useTranslate();
  const pickerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [[startDate, endDate], setDateRange] = useState([
    moment().startOf('week'),
    moment().endOf('week'),
  ]);

  useEffect(() => {
    setPage(query.page);
    setItemsPerPage(query.itemsPerPage);
  }, [query]);

  const handleFilterSubmit = () => {
    setIsLoading(true);
    console.log(startDate, endDate);
    setIsLoading(false);
  };

  const handleDatePickerOpen = () => setShowDatePicker(true);

  const handleDatePickerClose = () => setShowDatePicker(false);

  const handleDateChange = (data: {
    range1: { startDate: Date; endDate: Date };
  }) => {
    const { startDate, endDate } = data.range1;
    setDateRange([moment(startDate), moment(endDate)]);
  };

  return (
    <div className={styles.reportPayments}>
      <StatisticFilter onUpdate={handleFilterSubmit} isLoading={isLoading}>
        <EASTextField
          ref={pickerRef}
          containerClass={styles.selectControlRoot}
          fieldLabel={textForKey('period')}
          readOnly
          onPointerUp={handleDatePickerOpen}
          value={`${startDate.format('DD MMM YYYY')} - ${endDate.format(
            'DD MMM YYYY',
          )}`}
        />
      </StatisticFilter>

      <EasyDateRangePicker
        onChange={handleDateChange}
        onClose={handleDatePickerClose}
        dateRange={{ startDate: startDate.toDate(), endDate: endDate.toDate() }}
        open={showDatePicker}
        pickerAnchor={pickerRef.current}
      />
    </div>
  );
};

export default Payments;
