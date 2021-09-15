import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import Form from "react-bootstrap/Form";
import * as locales from "react-date-range/dist/locale";
import { Calendar } from "react-date-range";
import { toast } from "react-toastify";
import moment from "moment-timezone";

import { getAppLanguage, textForKey } from "../../../../../utils/localization";
import EasyPlanModal from "../EasyPlanModal";

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

  return (
    <EasyPlanModal
      open={open}
      onClose={onClose}
      size='sm'
      onPositiveClick={handleConfirmed}
      isPositiveLoading={isLoading}
      isPositiveDisabled={isLoading}
      title={textForKey('Select new date')}
    >
      <Calendar
        minDate={minDate}
        locale={locales[getAppLanguage()]}
        onChange={handleDateChange}
        date={date}
      />
      {isHourRequired && (
        <Form.Group style={{ width: '100%' }} controlId='startTime'>
          <Form.Label>{textForKey('Hour')}</Form.Label>
          <Form.Control
            as='select'
            onChange={handleHourChange}
            value={hour}
            disabled={isLoading || hours.length === 0}
            custom
          >
            {hours.map((item) => (
              <option key={`start-${item}`} value={item}>
                {item}
              </option>
            ))}
            {hours.length === 0 && (
              <option value={-1}>{textForKey('No available time')}</option>
            )}
          </Form.Control>
        </Form.Group>
      )}
    </EasyPlanModal>
  )
}

export default EasyDatePickerModal;

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
