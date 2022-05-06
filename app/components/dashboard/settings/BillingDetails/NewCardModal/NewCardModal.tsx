import React, { useState, useMemo, useEffect } from 'react';
import {
  TextField,
  SelectMenu,
  Typography,
  Spacer,
  LoadingButton,
  IconButton,
  theme,
} from '@easyplanpro/easyplan-components';
import { SelectChangeEvent, Modal, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { textForKey } from 'app/utils/localization';
import {
  paymentsPaymentMethodsSelector,
  paymentsNewCardModalSelector,
} from 'redux/selectors/paymentsSelector';
import {
  clearPaymentMethodsError,
  closeNewCardModal,
  dispatchAddNewPaymentMethod,
  setPaymentMethodsError,
} from 'redux/slices/paymentSlice';
import styles from './NewCardModal.module.scss';
import { NewCardModalProps } from './NewCardModal.types';

const defaultCardValues = {
  cardHolder: '',
  cardNumber: '',
  expiryMonth: -1,
  expiryYear: -1,
  cvc: '',
};

const defaultAddressValue = {
  country: -1,
  city: '',
  addressLine1: '',
  addressLine2: '',
  state: '',
  zip: '',
};

const NewCardModal: React.FC<NewCardModalProps> = ({ countries }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(paymentsPaymentMethodsSelector);
  const modalOpen = useSelector(paymentsNewCardModalSelector);
  const [cardFormData, setCardFormData] = useState(defaultCardValues);
  const [addressFormData, setAddressFormData] = useState(defaultAddressValue);

  useEffect(() => {
    return () => {
      dispatch(clearPaymentMethodsError());
    };
  }, []);

  const months = useMemo(() => {
    const months = new Array(12)
      .fill(0)
      .map((item, idx) => ({ id: idx + 1, name: String(idx + 1) }));
    return [{ id: -1, name: textForKey('payment_mm') }, ...months];
  }, []);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsArr = [];
    for (let i = 0; i < 6; i++) {
      yearsArr.push({ id: currentYear + i, name: String(currentYear + i) });
    }

    return [{ id: -1, name: textForKey('payment_yy') }, ...yearsArr];
  }, []);

  const handleValidationDateChange = (
    evt: SelectChangeEvent<string | number>,
  ) => {
    const { value, name } = evt.target;
    setCardFormData((cardFormData) => ({ ...cardFormData, [name]: value }));
  };

  const handleCardFormTextChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = evt.target;
    setCardFormData((cardFormData) => ({ ...cardFormData, [name]: value }));

    if (error) {
      dispatch(setPaymentMethodsError(null));
    }
  };

  const handleAddressFormTextChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = evt.target;
    setAddressFormData((addressFormData) => ({
      ...addressFormData,
      [name]: value,
    }));
    if (error) {
      dispatch(setPaymentMethodsError(null));
    }
  };

  const handleCountryChange = (evt: SelectChangeEvent<string | number>) => {
    const { name, value } = evt.target;
    setAddressFormData((addressFormData) => ({
      ...addressFormData,
      [name]: value,
    }));
    if (error) {
      dispatch(setPaymentMethodsError(null));
    }
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const selectedCountry = countries.find(
      (country) => country.id === addressFormData.country,
    );

    if (!selectedCountry) return;

    const body = {
      ...cardFormData,
      address: {
        ...addressFormData,
        country: selectedCountry.iso2,
      },
    };

    dispatch(dispatchAddNewPaymentMethod(body));
  };

  const handleCloseModal = () => dispatch(closeNewCardModal());

  const isFormValid = () => {
    const { cardNumber, cardHolder, cvc, expiryMonth, expiryYear } =
      cardFormData;
    const cardNumberValid =
      cardNumber.length === 16 || cardNumber.length === 15;
    const cardHolderValid = cardHolder !== '' && cardHolder.includes(' ');
    const cvcValid = cvc.length === 3 || cvc.length === 4;
    const expiryMonthValid = expiryMonth > 0;
    const expiryYearValid = expiryYear > 0;

    const cardDataValid =
      cardNumberValid &&
      cardHolderValid &&
      cvcValid &&
      expiryMonthValid &&
      expiryYearValid;

    const { addressLine1, city, zip, country } = addressFormData;
    const addressLineValid = addressLine1 !== '';
    const cityValid = city !== '';
    const zipValid = zip !== '';
    const countryValid = country > 0;

    const addressDataValid =
      addressLineValid && cityValid && zipValid && countryValid;

    return cardDataValid && addressDataValid;
  };

  return (
    <Modal open={modalOpen} onBackdropClick={handleCloseModal}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <IconButton
          icon={'close-icon'}
          className={styles.closeBtn}
          onClick={handleCloseModal}
        />
        <Typography variant={'titleSmall'}>
          {textForKey('payment_title')}
        </Typography>
        <Typography variant='uppercaseSmall' color={theme.palette.primary.main}>
          {textForKey('payment_info_card')}
        </Typography>
        <Spacer direction='vertical' size={1.5} />
        <TextField
          label={textForKey('payment_card_holder')}
          fullWidth
          value={cardFormData.cardHolder}
          name='cardHolder'
          onChange={handleCardFormTextChange}
        />
        <TextField
          label={textForKey('payment_card_number')}
          fullWidth
          type={'number'}
          inputMode='numeric'
          value={cardFormData.cardNumber}
          name='cardNumber'
          onChange={handleCardFormTextChange}
        />
        <div className={styles.flexContainer}>
          <SelectMenu
            options={months}
            value={cardFormData.expiryMonth}
            label={textForKey('payment_valid_till')}
            onChange={handleValidationDateChange}
            name='expiryMonth'
          />
          <SelectMenu
            options={years}
            value={cardFormData.expiryYear}
            onChange={handleValidationDateChange}
            name='expiryYear'
          />
          <TextField
            label={'CVV'}
            value={cardFormData.cvc}
            name='cvc'
            onChange={handleCardFormTextChange}
          />
        </div>
        <Spacer direction='vertical' size={2.5} />
        <Typography variant='uppercaseSmall' color={theme.palette.primary.main}>
          {textForKey('payment_info_address')}
        </Typography>
        <Spacer direction='vertical' size={1.5} />
        <SelectMenu
          options={countries}
          value={addressFormData.country}
          fullWidth
          label={textForKey('payment_country')}
          name={'country'}
          onChange={handleCountryChange}
        />
        <TextField
          label={textForKey('payment_city')}
          fullWidth
          name='city'
          value={addressFormData.city}
          onChange={handleAddressFormTextChange}
        />
        <TextField
          label={textForKey('payment_address1')}
          fullWidth
          name='addressLine1'
          value={addressFormData.addressLine1}
          onChange={handleAddressFormTextChange}
        />
        <TextField
          label={textForKey('payment_address2')}
          fullWidth
          name='addressLine2'
          value={addressFormData.addressLine2}
          onChange={handleAddressFormTextChange}
          topHelperText={textForKey('optional')}
        />
        <Box display='flex' sx={{ '&>*:first-child': { mr: '1em' } }}>
          <TextField
            label={textForKey('payment_zip')}
            fullWidth
            name='zip'
            value={addressFormData.zip}
            onChange={handleAddressFormTextChange}
          />
          <TextField
            label={textForKey('payment_state')}
            topHelperText={textForKey('optional')}
            fullWidth
            name='state'
            value={addressFormData.state}
            onChange={handleAddressFormTextChange}
          />
        </Box>
        <Box
          display='flex'
          justifyContent='flex-start'
          marginTop={'1.5em'}
          alignItems={'center'}
        >
          <LoadingButton
            label='Submit'
            variant='contained'
            size={'medium'}
            disabled={!isFormValid()}
            loading={loading}
            type={'submit'}
            sx={{ mr: '1.5em' }}
          />
          <Typography
            variant='overlineLarge'
            color={theme.palette.primary.main}
          >
            * {textForKey('payment_info_no_payment')}
          </Typography>
        </Box>
        {error && (
          <Typography variant='bodySmall' color={theme.palette.error.main}>
            {error}
          </Typography>
        )}
      </form>
    </Modal>
  );
};

export default NewCardModal;
