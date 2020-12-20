import React, { useEffect, useState } from 'react';

import { Box } from '@material-ui/core';
import sum from 'lodash/sum';
import PropTypes from 'prop-types';

import IconCheckBoxChecked from '../../assets/icons/iconCheckBoxChecked';
import IconCheckBoxUnchecked from '../../assets/icons/iconCheckBoxUnchecked';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';
import { getServiceName } from '../../utils/helperFuncs';

const FinalizeTreatmentModal = ({ open, services, onClose, onSave }) => {
  const [planServices, setPlanServices] = useState([]);

  useEffect(() => {
    setPlanServices(
      services.map(item => ({
        ...item,
        selected: false,
        isBraces: item.serviceType == null,
      })),
    );
  }, [services]);

  const handleServiceToggle = service => {
    const newServices = planServices.map(item => {
      if (
        item.id !== service.id ||
        item.toothId !== service.toothId ||
        item.destination !== service.destination
      ) {
        return item;
      }

      return {
        ...item,
        selected: !item.selected,
      };
    });
    setPlanServices(newServices);
  };

  const handleSaveTreatment = () => {
    onSave(planServices);
  };

  const totalPrice = sum(
    planServices.filter(item => item.selected).map(item => item.price),
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
        {planServices.map(item => (
          <div
            role='button'
            tabIndex={0}
            key={`${item.id}-${item.toothId}-${item.name}`}
            className='final-service-item'
            onClick={() => handleServiceToggle(item)}
          >
            <span className='service-name'>{getServiceName(item)}</span>
            <Box display='flex' alignItems='center'>
              <span className='service-price'>{item.price} MDL</span>
              {item.selected ? (
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
      id: PropTypes.number,
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
