import React, { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { toast } from "react-toastify";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Form from "react-bootstrap/Form";
import moment from "moment-timezone";
import debounce from 'lodash/debounce';

import { fetchAllServices } from "../../../../../../middleware/api/services";
import { ScheduleStatuses } from "../../../../../utils/constants";
import { textForKey } from "../../../../../../utils/localization";
import CheckableMenuItem from "../../../../common/CheckableMenuItem";
import EasyDateRangePicker from "../../../../common/EasyDateRangePicker";
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
import styles from './ReceiversFilter.module.scss';

const defaultRange = {
  startDate: moment().toDate(),
  endDate: moment().add(7, 'days').toDate(),
};

const selectMenuProps = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left"
  },
  getContentAnchorEl: null
}

const ReceiversFilter = ({ currentClinic, isLoading, initialData, recipientsCount, onChange }) => {
  const pickerRef = useRef(null);
  const [{
    selectedStatuses,
    selectedCategories,
    categories,
    services,
    selectedServices,
    showRangePicker,
    dateRange,
  }, localDispatch] = useReducer(reducer, initialState);

  const filteredServices = useMemo(() => {
    const categoriesId = selectedCategories.map(item => item.id);
    return services.filter(service => {
      return categoriesId.includes(-1) || categoriesId.includes(service.categoryId);
    })
  }, [services, selectedCategories]);

  const rangeObj = useMemo(() => {
    if (dateRange.length === 0) {
      return null
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
    ).format('DD MMM YYYY')}`
  }, [rangeObj]);

  const handleFilterChange = useCallback(debounce((filterData) => {
    onChange?.(filterData)
  }, 400), [selectedStatuses, selectedCategories, selectedServices, dateRange]);

  useEffect(() => {
    if (initialData == null) {
      return;
    }

    localDispatch(setFilterData({ ...initialData, clinicData: { services, categories } }));
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
  }, [selectedStatuses, selectedCategories, selectedServices, dateRange, handleFilterChange]);

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
  }

  const handleStatusChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1]
    if (newValue.length === 0 || lastSelected === 'All') {
      localDispatch(setSelectedStatuses([{ id: 'All' }]));
      return;
    }
    const newStatuses = ScheduleStatuses.filter((status) =>
      newValue.some(item => item === status.id)
    );
    localDispatch(setSelectedStatuses(newStatuses.filter(status => status.id !== 'All')));
  };

  const handleCategoriesChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1]
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedCategories([{ id: -1 }]));
      return;
    }
    const newCategories = categories.filter((category) =>
      newValue.some(item => item === category.id)
    );
    localDispatch(setSelectedCategories(newCategories.filter(category => category.id !== -1)));
  };

  const handleServicesChange = (event) => {
    const newValue = event.target.value;
    const lastSelected = newValue[newValue.length - 1]
    if (newValue.length === 0 || lastSelected === -1) {
      localDispatch(setSelectedServices([{ id: -1 }]));
      return;
    }
    const newServices = services.filter((category) =>
      newValue.some(item => item === category.id)
    );
    localDispatch(setSelectedServices(newServices.filter(category => category.id !== -1)));
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

  const renderSelectedStatuses = (selected) => {
    const statuses = selectedStatuses.filter(status =>
      selected.includes(status.id),
    )
    return statuses.map(status => status.name ?? textForKey('All statuses')).join(', ')
  }

  const renderSelectedCategories = (selected) => {
    const categories = selectedCategories.filter(category =>
      selected.includes(category.id),
    )
    return categories.map(category => category.name ?? textForKey('All categories')).join(', ')
  }

  const renderSelectedServices = (selected) => {
    const services = selectedServices.filter(service =>
      selected.includes(service.id),
    )
    return services.map(service => service.name ?? textForKey('All services')).join(', ')
  }

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
              {textForKey('Receivers')}: ~ {recipientsCount} {textForKey('patients').toLowerCase()}
            </Typography>
          )}
        </div>
        {/* Statuses */}
        <FormControl classes={{ root: styles.selectControlRoot }}>
          <InputLabel id="statuses-select-label">
            {textForKey('Statuses')}
          </InputLabel>
          <Select
            multiple
            disableUnderline
            labelId='statuses-select-label'
            value={selectedStatuses.map(item => item.id)}
            MenuProps={selectMenuProps}
            renderValue={renderSelectedStatuses}
            onChange={handleStatusChange}
          >
            <CheckableMenuItem
              value="All"
              checked={selectedStatuses.some(item => item.id === 'All')}
              title={textForKey('All statuses')}
            />
            {ScheduleStatuses.map((status) => (
              <CheckableMenuItem
                key={status.id}
                value={status.id}
                checked={selectedStatuses.some(item => item.id === status.id)}
                title={status.name}
              />
            ))}
          </Select>
        </FormControl>
        {/* Categories */}
        <FormControl classes={{ root: styles.selectControlRoot }}>
          <InputLabel id="categories-select-label">
            {textForKey('Categories')}
          </InputLabel>
          <Select
            multiple
            disableUnderline
            labelId='categories-select-label'
            value={selectedCategories.map(item => item.id)}
            MenuProps={selectMenuProps}
            renderValue={renderSelectedCategories}
            onChange={handleCategoriesChange}
          >
            <CheckableMenuItem
              value={-1}
              checked={selectedCategories.some(item => item.id === -1)}
              title={textForKey('All categories')}
            />
            {categories.map((category) => (
              <CheckableMenuItem
                key={category.id}
                value={category.id}
                checked={selectedCategories.some(item => item.id === category.id)}
                title={category.name}
              />
            ))}
          </Select>
        </FormControl>
        {/* Services */}
        <FormControl classes={{ root: styles.selectControlRoot }}>
          <InputLabel id="services-select-label">
            {textForKey('Services')}
          </InputLabel>
          <Select
            multiple
            disableUnderline
            labelId='services-select-label'
            value={selectedServices.map(item => item.id)}
            MenuProps={selectMenuProps}
            renderValue={renderSelectedServices}
            onChange={handleServicesChange}
          >
            <CheckableMenuItem
              value={-1}
              checked={selectedServices.some(item => item.id === -1)}
              title={textForKey('All services')}
            />
            {filteredServices.map((service) => (
              <CheckableMenuItem
                key={service.id}
                value={service.id}
                checked={selectedServices.some(item => item.id === service.id)}
                title={service.name}
              />
            ))}
          </Select>
        </FormControl>
        {/* Date picker */}
        <Form.Group ref={pickerRef}>
          <Form.Label>{textForKey('Period')}</Form.Label>
          <Form.Control
            readOnly
            disabled={isLoading}
            value={rangeLabel}
            onClick={handleDatePickerOpen}
          />
        </Form.Group>
      </div>
    </div>
  );
};

export default ReceiversFilter;
