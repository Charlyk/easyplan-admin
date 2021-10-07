import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import Box from "@material-ui/core/Box";
import * as locales from "react-date-range/dist/locale";
import { Calendar } from "react-date-range";
import { toast } from "react-toastify";
import moment from "moment-timezone";

import areComponentPropsEqual from "../../../../utils/areComponentPropsEqual";
import { getAppLanguage, textForKey } from "../../../../../utils/localization";
import EASModal from "../EASModal";
import EASSelect from "../../EASSelect";

const EasyDatePickerModal = (
  {
    open,
    selectedDate,
    minDate,
    isHourRequired,
    onSelected,
    onClose,
    fetchHours
  }
) => {
  const [date, setDate] = useState(selectedDate);
  const [hour, setHour] = useState(moment(selectedDate).format('HH:mm'))
  const [isLoading, setIsLoading] = useState(false);
  const [hours, setHours] = useState([]);

  useEffect(() => {
    if (!isHourRequired || typeof fetchHours !== 'function') {
      return;
    }

    handleFetchHours();
  }, [date]);

  const handleFetchHours = async () => {
    setIsLoading(true);
    try {
      const response = await fetchHours();
      const { data: availableTime } = response;
      setHours(availableTime);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDateChange = (newDate) => {
    setDate(newDate);
  }

  const handleConfirmed = () => {
    const momentDate = moment(date);
    if (isHourRequired) {
      const [h, m] = hour.split(':');
      momentDate.set('hour', parseInt(h))
        .set('minute', parseInt(m));
    }
    onSelected(momentDate.toDate());
  }

  const handleHourChange = (event) => {
    setHour(event.target.value);
  }

  const mappedHours = useMemo(() => {
    return hours.map(item => ({
      id: item,
      name: item,
    }));
  }, [hours]);

  return (
    <EASModal
      open={open}
      onClose={onClose}
      size='sm'
      onPrimaryClick={handleConfirmed}
      primaryBtnText={textForKey('Save')}
      isPositiveLoading={isLoading}
      isPositiveDisabled={isLoading}
      title={textForKey('Select new date')}
    >
      <Box padding='16px' display='flex' flexDirection='column'>
      <Calendar
        minDate={minDate}
        locale={locales[getAppLanguage()]}
        onChange={handleDateChange}
        date={date}
      />
      {isHourRequired && (
        <EASSelect
          label={textForKey('Hour')}
          labelId="hour-select-label"
          value={hour}
          options={mappedHours}
          onChange={handleHourChange}
        />
      )}
      </Box>
    </EASModal>
  )
}

export default React.memo(EasyDatePickerModal, areComponentPropsEqual);

EasyDatePickerModal.propTypes = {
  open: PropTypes.bool,
  selectedDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  isHourRequired: PropTypes.bool,
  onSelected: PropTypes.func,
  onClose: PropTypes.func,
  fetchHours: PropTypes.func,
};

EasyDatePickerModal.defaultProps = {
  open: true,
  selectedDate: new Date(),
  minDate: null,
  isHourRequired: false,
  onSelected: () => null,
  onClose: () => null,
}
