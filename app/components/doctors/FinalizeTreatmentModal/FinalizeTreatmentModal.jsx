import React, { useEffect, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import sum from 'lodash/sum';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

import IconMinus from '../../icons/iconMinus';
import IconPlus from '../../icons/iconPlus';
import getClinicExchangeRates from '../../../../utils/getClinicExchangeRates';
import getServiceName from '../../../../utils/getServiceName';
import formattedAmount from '../../../../utils/formattedAmount';
import { textForKey } from '../../../../utils/localization';
import EasyPlanModal from '../../common/modals/EasyPlanModal';
import styles from './FinalizeTreatmentModal.module.scss';

const FinalizeTreatmentModal = ({ open, services, currentClinic, onClose, onSave }) => {
  const menuRef = useRef(null);
  const [serviceToChange, setServiceToChange] = useState(null);
  const [planServices, setPlanServices] = useState([]);
  const rates = getClinicExchangeRates(currentClinic);
  const clinicCurrency = currentClinic.currentUser;

  useEffect(() => {
    const newServices = services.map((item) => ({
      ...item,
      isSelected: item.completed,
      isBraces: item.serviceType == null,
    }));
    setPlanServices(newServices);
  }, [services]);

  const handleItemPriceChanged = (service) => (event) => {
    const newServices = planServices.map((item) => {
      if (
        item.id !== service.id ||
        item.toothId !== service.toothId ||
        item.destination !== service.destination
      ) {
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
    if (!planServices.some((it) => it.isSelected)) {
      toast(textForKey('Please select at least one service'));
      return;
    }
    onSave(
      planServices.map((item) => ({
        ...item,
        price: parseFloat(item.price),
      })),
    );
  };

  const handleAddService = (service) => () => {
    setPlanServices(
      planServices.map((item) => {
        if (
          item.id !== service.id ||
          item.toothId !== service.toothId ||
          item.destination !== service.destination
        ) {
          return item;
        }

        return {
          ...item,
          count: item.count + 1,
        };
      }),
    );
  };

  const handleRemoveService = (service) => () => {
    setPlanServices(
      planServices.map((item) => {
        if (
          item.id !== service.id ||
          item.toothId !== service.toothId ||
          item.destination !== service.destination
        ) {
          return item;
        }

        let newCount = item.count - 1;
        if (newCount < 1) newCount = 1;

        return {
          ...item,
          count: newCount,
        };
      }),
    );
  };

  const handleServiceChecked = (event, isChecked) => {
    const [serviceId, toothId, destination] = event.target.id.split('#');
    const service = planServices.find(
      (item) =>
        item.id === parseInt(serviceId) &&
        (item.toothId == null || item.toothId === toothId) &&
        (item.destination == null || item.destination === destination),
    );
    setPlanServices(
      planServices.map((item) => {
        if (
          item.id !== service.id ||
          item.toothId !== service.toothId ||
          item.destination !== service.destination
        ) {
          return item;
        }
        return {
          ...item,
          isSelected: isChecked,
        };
      }),
    );
  };

  const handleCurrencyClick = (service) => (event) => {
    menuRef.current = event.target;
    setServiceToChange(service);
  };

  const handleCurrencySelected = (rate) => () => {
    const newServices = planServices.map((item) => {
      if (
        item.id !== serviceToChange.id ||
        item.toothId !== serviceToChange.toothId ||
        item.destination !== serviceToChange.destination
      ) {
        return item;
      }
      return {
        ...item,
        currency: rate.currency,
      };
    });
    setPlanServices(newServices);
    handleCloseCurrency();
  };

  const handleCloseCurrency = () => {
    setServiceToChange(null);
  };

  const getServiceRate = (service) => {
    return (
      rates?.find((item) => item.currency === service.currency) || {
        value: 1,
        currency: clinicCurrency,
      }
    );
  };

  const totalPrice = sum(
    planServices
      .filter((item) => item.isSelected)
      .map((item) => {
        const itemRate = getServiceRate(item);
        return parseFloat(item.price) * itemRate.value * item.count;
      }),
  );

  const ratesMenu = (
    <Menu open={Boolean(serviceToChange)} anchorEl={menuRef.current}>
      {rates?.map((rate) => (
        <MenuItem onClick={handleCurrencySelected(rate)} key={rate.currency}>
          {rate.currency} - {rate.currencyName}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <EasyPlanModal
      className={styles['finalize-treatment-root']}
      open={open}
      onClose={onClose}
      isPositiveDisabled={!planServices.some((it) => it.isSelected)}
      onPositiveClick={handleSaveTreatment}
      positiveBtnText={textForKey('Finalize')}
      title={textForKey('Finalize treatment')}
    >
      {ratesMenu}
      <div className={styles['finalize-treatment-content']}>
        <span className={styles['modal-subtitle']}>{textForKey('Services')}</span>
        {planServices.map((item) => (
          <div
            role='button'
            tabIndex={0}
            key={`${item.id}-${item.toothId}-${item.name}-${item.completed}-${item.completedAt}`}
            className={styles['final-service-item']}
          >
            <span className={styles['service-name']}>{getServiceName(item)}</span>
            <Box display='flex' alignItems='center'>
              <IconButton
                onClick={handleRemoveService(item)}
                style={{ outline: 'none' }}
              >
                <IconMinus fill='#3A83DC' />
              </IconButton>
              <Typography className={styles['count-label']}>
                {item.count}
              </Typography>
              <IconButton
                onClick={handleAddService(item)}
                style={{ outline: 'none' }}
              >
                <IconPlus fill='#3A83DC' />
              </IconButton>
              <InputGroup className={styles['price-form-group']}>
                <Form.Control
                  type='number'
                  onChange={handleItemPriceChanged(item)}
                  value={String(item.price)}
                />
                <InputGroup.Append>
                  <Button
                    onClick={handleCurrencyClick(item)}
                    variant='outline-primary'
                  >
                    {item.currency || clinicCurrency}
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <Checkbox
                id={`${item.id}#${item.toothId}#${item.destination}#${item.completed}#${item.completedAt}`}
                className={styles['service-check-box']}
                checked={Boolean(item.isSelected)}
                onChange={handleServiceChecked}
              />
            </Box>
          </div>
        ))}
        <div className={styles['totals-text-wrapper']}>
          {textForKey('Total')}: {formattedAmount(totalPrice, clinicCurrency)}
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
