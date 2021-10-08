import React, { useEffect, useMemo, useState } from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import sum from 'lodash/sum';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import IconMinus from '../../icons/iconMinus';
import IconPlus from '../../icons/iconPlus';
import getClinicExchangeRates from '../../../utils/getClinicExchangeRates';
import getServiceName from '../../../utils/getServiceName';
import formattedAmount from '../../../utils/formattedAmount';
import { textForKey } from '../../../utils/localization';
import styles from './FinalizeTreatmentModal.module.scss';
import EASModal from "../../common/modals/EASModal";
import EASTextField from "../../common/EASTextField";
import EASSelect from "../../common/EASSelect";

const FinalizeTreatmentModal = ({ open, services, currentClinic, onClose, onSave }) => {
  const [planServices, setPlanServices] = useState([]);
  const rates = getClinicExchangeRates(currentClinic);
  const clinicCurrency = currentClinic.currentUser;

  const mappedCurrencies = useMemo(() => {
    return rates.map((item) => ({
      id: item.currency,
      name: item.currency,
      currency: item.currency,
    }))
  }, [rates]);

  useEffect(() => {
    const newServices = services.map((item) => ({
      ...item,
      isSelected: item.completed,
      isBraces: item.serviceType == null,
    }));
    setPlanServices(newServices);
  }, [services]);

  const handleItemPriceChanged = (service) => (newPrice) => {
    const newServices = planServices.map((item) => {
      if (
        item.id !== service.id ||
        item.toothId !== service.toothId ||
        item.destination !== service.destination
      ) {
        return item;
      }

      let newValue = newPrice;

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

  const handleCurrencySelected = (serviceToChange) => (event) => {
    const rate = rates.find(item => item.currency === event.target.value);
    if (rate == null) return;
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

  return (
    <EASModal
      open={open}
      onClose={onClose}
      paperClass={styles.modalPaper}
      className={styles.finalizeTreatmentRoot}
      isPositiveDisabled={!planServices.some((it) => it.isSelected)}
      onPrimaryClick={handleSaveTreatment}
      primaryBtnText={textForKey('Finalize')}
      title={textForKey('Finalize treatment')}
    >
      <div className={styles.finalizeTreatmentContent}>
        <span className={styles.modalSubtitle}>{textForKey('Services')}</span>
        {planServices.map((item) => (
          <div
            role='button'
            tabIndex={0}
            key={`${item.id}-${item.toothId}-${item.name}-${item.completed}-${item.completedAt}`}
            className={styles.finalServiceItem}
          >
            <span className={styles.serviceName}>{getServiceName(item)}</span>
            <Box display='flex' alignItems='center'>
              <IconButton
                className={styles.minusBtn}
                onClick={handleRemoveService(item)}
                style={{ outline: 'none' }}
              >
                <IconMinus fill='#3A83DC' />
              </IconButton>
              <Typography className={styles.countLabel}>
                {item.count}
              </Typography>
              <IconButton
                onClick={handleAddService(item)}
                style={{ outline: 'none' }}
              >
                <IconPlus fill='#3A83DC' />
              </IconButton>
              <EASTextField
                type="number"
                containerClass={styles.priceField}
                value={String(item.price)}
                endAdornment={
                  <EASSelect
                    rootClass={styles.currencies}
                    value={item.currency}
                    options={mappedCurrencies}
                    onChange={handleCurrencySelected(item)}
                  />
                }
                onChange={handleItemPriceChanged(item)}
              />
              <Checkbox
                id={`${item.id}#${item.toothId}#${item.destination}#${item.completed}#${item.completedAt}`}
                className={styles.serviceCheckBox}
                checked={Boolean(item.isSelected)}
                onChange={handleServiceChecked}
              />
            </Box>
          </div>
        ))}
        <div className={styles.totalsTextWrapper}>
          {textForKey('Total')}: {formattedAmount(totalPrice, clinicCurrency)}
        </div>
      </div>
    </EASModal>
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
