import React, { useEffect, useState } from 'react';

import { Box, IconButton, Typography } from '@material-ui/core';
import sum from 'lodash/sum';
import PropTypes from 'prop-types';

import IconMinus from '../../assets/icons/iconMinus';
import IconPlus from '../../assets/icons/iconPlus';
import { getServiceName } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const FinalizeTreatmentModal = ({ open, services, onClose, onSave }) => {
  const [planServices, setPlanServices] = useState([]);

  useEffect(() => {
    setPlanServices(
      services.map(item => ({
        ...item,
        count: 0,
        isBraces: item.serviceType === 'Braces',
      })),
    );
  }, [services]);

  const handleItemPriceChanged = service => event => {
    const newServices = planServices.map(item => {
      if (item.id !== service.id) {
        return item;
      }

      let newValue = event.target.value;

      if (newValue.length === 0) {
        newValue = '0';
      }

      if (newValue.length > 1 && newValue[0] === '0') {
        newValue = newValue.replace(/^./, '');
      }

      return {
        ...item,
        price: newValue,
      };
    });
    setPlanServices(newServices);
  };

  const handleSaveTreatment = () => {
    onSave(
      planServices.map(item => ({
        ...item,
        price: parseFloat(item.price),
      })),
    );
  };

  const handleAddService = service => () => {
    setPlanServices(
      planServices.map(item => {
        if (item.id !== service.id) {
          return item;
        }

        return {
          ...item,
          count: item.count + 1,
        };
      }),
    );
  };

  const handleRemoveService = service => () => {
    setPlanServices(
      planServices.map(item => {
        if (item.id !== service.id) {
          return item;
        }

        let newCount = item.count - 1;
        if (newCount < 0) newCount = 0;

        return {
          ...item,
          count: newCount,
        };
      }),
    );
  };

  const totalPrice = sum(
    planServices.map(item => parseFloat(item.price) * item.count),
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
          >
            <span className='service-name'>{getServiceName(item)}</span>
            <Box display='flex' alignItems='center'>
              <input
                className='service-price-input'
                type='number'
                value={item.price}
                onChange={handleItemPriceChanged(item)}
              />
              <IconButton
                onClick={handleRemoveService(item)}
                style={{ outline: 'none' }}
              >
                <IconMinus fill='#3A83DC' />
              </IconButton>
              <Typography>{item.count}</Typography>
              <IconButton
                onClick={handleAddService(item)}
                style={{ outline: 'none' }}
              >
                <IconPlus fill='#3A83DC' />
              </IconButton>
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
