import React, { useEffect, useState } from 'react';

import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { DateRange } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';

import { getAppLanguage, textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';

const initialRange = {
  startDate: moment().toDate(),
  endDate: moment().add(3, 'days').toDate(),
  key: 'selection',
  color: '#3A83DC',
};

const CreateHolidayModal = ({ show, onClose, onCreate, holiday }) => {
  const [description, setDescription] = useState('');
  const [dateRanges, setDateRanges] = useState([initialRange]);

  useEffect(() => {
    if (holiday != null) {
      setDescription(holiday.description || '');
      setDateRanges([
        {
          ...initialRange,
          startDate: moment(holiday.startDate).toDate(),
          endDate: moment(holiday.endDate).toDate(),
        },
      ]);
    }
  }, [holiday]);

  /**
   * Called when date range is changed
   * @param {Object} item
   * @param {Object} item.selection
   * @param {Date} item.selection.startDate
   * @param {Date} item.selection.endDate
   * @param {string} item.selection.color
   * @param {string} item.selection.key
   */
  const handleDateSelected = (item) => {
    setDateRanges([item.selection]);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleCloseModal = () => {
    setDescription('');
    setDateRanges([initialRange]);
    onClose();
  };

  const handleSaveHoliday = () => {
    onCreate({
      id: holiday?.id,
      startDate: moment(dateRanges[0].startDate).format('yyyy-MM-DD'),
      endDate: moment(dateRanges[0].endDate).format('yyyy-MM-DD'),
      description,
    });
    handleCloseModal();
  };

  return (
    <EasyPlanModal
      onClose={handleCloseModal}
      open={show}
      title={textForKey('Add holiday')}
      onPositiveClick={handleSaveHoliday}
    >
      <div className='holiday-modal__body'>
        <DateRange
          onChange={handleDateSelected}
          moveRangeOnFirstSelection={false}
          minDate={new Date()}
          months={2}
          direction='horizontal'
          ranges={dateRanges}
          locale={locales[getAppLanguage()]}
        />
        <Form.Group controlId='description'>
          <Form.Label>{textForKey('Description')}</Form.Label>
          <InputGroup>
            <Form.Control
              value={description}
              onChange={handleDescriptionChange}
              as='textarea'
              aria-label='With textarea'
            />
          </InputGroup>
        </Form.Group>
      </div>
    </EasyPlanModal>
  );
};

export default CreateHolidayModal;

CreateHolidayModal.propTypes = {
  show: PropTypes.bool.isRequired,
  holiday: PropTypes.shape({
    id: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    description: PropTypes.string,
  }),
  onCreate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
