import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import Typography from '@material-ui/core/Typography';
import debounce from 'lodash/debounce';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import { ScheduleStatuses } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import { fetchAllServices } from 'middleware/api/services';
import styles from './ReceiversFilter.module.scss';
import reducer, {
  initialState,
  setSelectedStatuses,
  setSelectedCategories,
  setResponseData,
  setSelectedServices,
  setShowRangePicker,
  setDateRange,
  setFilterData,
} from './receiversFilterSlice';

const EasyDateRangePicker = dynamic(() =>
  import('app/components/common/EasyDateRangePicker'),
);

const defaultRange = {
  startDate: moment().toDate(),
  endDate: moment().add(7, 'days').toDate(),
};

const ReceiversFilter = ({
  currentClinic,
  initialData,
  recipientsCount,
  onChange,
}) => {
  const pickerRef = useRef(null);
  const [
    {
      selectedStatuses,
      selectedCategories,
      categories,
      services,
      selectedServices,
      showRangePicker,
      dateRange,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const filteredServices = useMemo(() => {
    const categoriesId = selectedCategories.map((item) => item.id);
    return services.filter((service) => {
      return (
        categoriesId.includes(-1) || categoriesId.includes(service.categoryId)
      );
    });
  }, [services, selectedCategories]);

  const rangeObj = useMemo(() => {
    if (dateRange.length === 0) {
      return null;
    }
    const [startDate, endDate] = dateRange;
    return { startDate, endDate };
  }, [dateRange]);

  const rangeLabel = useMemo(() => {
    if (rangeObj == null) {
      return textForKey('All time');
    }
    return `${moment(rangeObj.startDate).format('DD MMM YYYY')} - ${moment(
      rangeObj.endDate,
    ).format('DD MMM YYYY')}`;
  }, [rangeObj]);

  const handleFilterChange = useCallback(
    debounce((filterData) => {
      onChange?.(filterData);
    }, 400),
    [selectedStatuses, selectedCategories, selectedServices, dateRange],
  );

  useEffect(() => {
    if (initialData == null) {
      return;
    }

    localDispatch(
      setFilterData({ ...initialData, clinicData: { services, categories } }),
    );
  }, [initialData, services, categories]);

  useEffect(() => {
    if (currentClinic != null) {
      fetchFilterData();
    }
  }, [currentClinic]);

  useEffect(() => {
    handleFilterChange({
      services: selectedServices,
      statuses: selectedStatuses,
      categories: selectedCategories,
      range: dateRange,
    });
  }, [
    selectedStatuses,
    selectedCategories,
    selectedServices,
    dateRange,
    handleFilterChange,
  ]);

  const fetchFilterData = async () => {
    try {
      const { data } = await fetchAllServices();
      localDispatch(setResponseData(data));
    } catch (error) {
      if (error.response != null) {
        const { data } = error.response;
        toast.error(data?.message || textForKey('something_went_wrong'));
      } else {
        toast.error(error.message || textForKey('something_went_wrong'));
      }
    }
  };

  const handleStatusChange = (event) => {
    const newValue = event.target.value;
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

  const handleCategoriesChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedCategories([{ id: -1 }]));
      return;
    }
    const newCategories = categories.filter((category) =>
      newValue.some((item) => item === category.id),
    );
    localDispatch(
      setSelectedCategories(
        newCategories.filter((category) => category.id !== -1),
      ),
    );
  };

  const handleServicesChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1];
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedServices([{ id: -1 }]));
      return;
    }
    const newServices = services.filter((category) =>
      newValue.some((item) => item === category.id),
    );
    localDispatch(
      setSelectedServices(newServices.filter((category) => category.id !== -1)),
    );
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

  return (
    <div className={styles.filterRoot}>
      <div className={styles.formContainer}>
        <EasyDateRangePicker
          onChange={handleDateChange}
          onClose={handleDatePickerClose}
          dateRange={rangeObj ?? defaultRange}
          open={showRangePicker}
          pickerAnchor={pickerRef.current}
        />

        <Typography className={styles.formTitle}>
          {textForKey('Receivers filter')}
        </Typography>
        <div className={styles.recipientsCount}>
          {recipientsCount > -1 && (
            <Typography className={styles.recipientsLabel}>
              {textForKey('Receivers')}: ~ {recipientsCount}{' '}
              {textForKey('patients').toLowerCase()}
            </Typography>
          )}
        </div>

        {/* Statuses */}
        <EASSelect
          multiple
          checkable
          rootClass={styles.simpleSelect}
          label={textForKey('Statuses')}
          labelId='statuses-select-label'
          options={ScheduleStatuses}
          defaultOption={{
            id: 'All',
            name: textForKey('All statuses'),
          }}
          value={selectedStatuses.map((item) => item.id)}
          onChange={handleStatusChange}
        />

        {/* Categories */}
        <EASSelect
          multiple
          checkable
          rootClass={styles.simpleSelect}
          label={textForKey('Categories')}
          labelId='categories-select-label'
          value={selectedCategories.map((item) => item.id)}
          options={categories}
          defaultOption={{
            id: -1,
            name: textForKey('All categories'),
          }}
          onChange={handleCategoriesChange}
        />

        {/* Services */}
        <EASSelect
          multiple
          checkable
          rootClass={styles.simpleSelect}
          label={textForKey('Services')}
          labelId='services-select-label'
          value={selectedServices.map((item) => item.id)}
          options={filteredServices}
          defaultOption={{
            id: -1,
            name: textForKey('All services'),
          }}
          onChange={handleServicesChange}
        />

        {/* Date picker */}
        <EASTextField
          readOnly
          ref={pickerRef}
          fieldLabel={textForKey('Period')}
          value={rangeLabel}
          onPointerUp={handleDatePickerOpen}
        />
      </div>
    </div>
  );
};

export default ReceiversFilter;
