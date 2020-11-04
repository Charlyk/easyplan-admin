import React, { useState } from 'react';

import { Box } from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import sum from 'lodash/sum';
import PropTypes from 'prop-types';

import IconCheckBoxChecked from '../../assets/icons/iconCheckBoxChecked';
import IconCheckBoxUnchecked from '../../assets/icons/iconCheckBoxUnchecked';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const FinalizeTreatmentModal = ({ open, services, onClose, onSave }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const handleServiceToggle = service => {
    const newServices = cloneDeep(selectedServices);
    if (
      newServices.some(
        item =>
          item.id === service.id &&
          item.toothId === service.toothId &&
          item.destination === service.destination,
      )
    ) {
      remove(
        newServices,
        item =>
          item.id === service.id &&
          item.toothId === service.toothId &&
          item.destination === service.destination,
      );
    } else {
      newServices.push(service);
    }
    setSelectedServices(newServices);
  };

  const handleSaveTreatment = () => {
    onSave(services, selectedServices);
  };

  const totalPrice = sum(selectedServices.map(item => item.price));

  const isChecked = item =>
    selectedServices.some(
      service =>
        service.id === item.id &&
        service.toothId === item.toothId &&
        service.destination === item.destination,
    );
  return (
    <EasyPlanModal
      open={open}
      onClose={onClose}
      onPositiveClick={handleSaveTreatment}
      positiveBtnText={textForKey('Finalize')}
      title={textForKey('Finalize treatment')}
    >
      <div className='finalize-treatment-content'>
        <span className='modal-subtitle'>{textForKey('Services')}</span>
        {services.map(item => (
          <div
            role='button'
            tabIndex={0}
            key={`${item.id}-${item.toothId}-${item.name}-${item.destination}`}
            className='final-service-item'
            onClick={() => handleServiceToggle(item)}
          >
            <span className='service-name'>
              {item.name} {item.toothId}
            </span>
            <Box display='flex' alignItems='center'>
              <span className='service-price'>{item.price} MDL</span>
              {isChecked(item) ? (
                <IconCheckBoxChecked />
              ) : (
                <IconCheckBoxUnchecked />
              )}
            </Box>
          </div>
        ))}
        <div className='totals-text-wrapper'>
          {textForKey('Total')}: {totalPrice} MDL
        </div>
      </div>
    </EasyPlanModal>
  );
};

export default FinalizeTreatmentModal;

FinalizeTreatmentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  totalPrice: PropTypes.number,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      price: PropTypes.number,
      color: PropTypes.string,
    }),
  ),
};

FinalizeTreatmentModal.defaultProps = {
  onClose: () => null,
  onSave: () => null,
  services: [],
};
