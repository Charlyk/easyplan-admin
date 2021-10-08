import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { DateRange } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';

import { getAppLanguage, textForKey } from '../../../../../utils/localization';
import EASTextarea from "../../../../common/EASTextarea";
import EASModal from "../../../../common/modals/EASModal";
import styles from './CreateHolidayModal.module.scss';

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

  const handleDescriptionChange = (newValue) => {
    setDescription(newValue);
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
    <EASModal
      open={show}
      title={textForKey('Add holiday')}
      onPrimaryClick={handleSaveHoliday}
      onClose={handleCloseModal}
    >
      <div className={styles['holiday-modal__body']}>
        <DateRange
          onChange={handleDateSelected}
          moveRangeOnFirstSelection={false}
          minDate={new Date()}
          months={2}
          direction='horizontal'
          ranges={dateRanges}
          locale={locales[getAppLanguage()]}
        />
        <EASTextarea
          type="text"
          fieldLabel={textForKey('Description')}
          value={description}
          rows={4}
          maxRows={4}
          onChange={handleDescriptionChange}
        />
      </div>
    </EASModal>
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
