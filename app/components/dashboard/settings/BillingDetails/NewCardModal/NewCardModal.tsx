import React, { useState, useMemo, useEffect } from 'react';
import { IconButton } from '@easyplanpro/easyplan-components';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import EASSelect from 'app/components/common/EASSelect';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import { textForKey } from 'app/utils/localization';
import {
  paymentsPaymentMethodsSelector,
  paymentsNewCardModalSelector,
  isPaymentDataLoadingSelector,
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
  const { error } = useSelector(paymentsPaymentMethodsSelector);
  const modalOpen = useSelector(paymentsNewCardModalSelector);
  const loading = useSelector(isPaymentDataLoadingSelector);
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
    for (let i = 0; i < 11; i++) {
      yearsArr.push({ id: currentYear + i, name: String(currentYear + i) });
    }

    return [{ id: -1, name: textForKey('payment_yy') }, ...yearsArr];
  }, []);

  const handleExpirationMonthChange = (
    evt: SelectChangeEvent<string | number>,
  ) => {
    const { value } = evt.target;
    setCardFormData((cardFormData) => ({
      ...cardFormData,
      expiryMonth: value as number,
    }));
  };

  const handleExpirationYearChange = (
    evt: SelectChangeEvent<string | number>,
  ) => {
    const { value } = evt.target;
    setCardFormData((cardFormData) => ({
      ...cardFormData,
      expiryYear: value as number,
    }));
  };

  const handleCountryChange = (evt: any) => {
    const { value } = evt.target;
    setAddressFormData((addressFormData) => ({
      ...addressFormData,
      ['country']: value,
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
    <Modal open={modalOpen} onClose={handleCloseModal}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <IconButton
          icon={'close-icon'}
          className={styles.closeBtn}
          onClick={handleCloseModal}
        />
        <Typography variant={'body1'}>{textForKey('payment_title')}</Typography>
        <Typography variant='h6' classes={{ root: styles.headline }}>
          {textForKey('payment_info_card')}
        </Typography>
        <EASTextField
          fieldLabel={textForKey('payment_card_holder')}
          fullWidth
          value={cardFormData.cardHolder}
          name='cardHolder'
          onChange={(value) =>
            setCardFormData({ ...cardFormData, cardHolder: value as string })
          }
        />
        <EASTextField
          fieldLabel={textForKey('payment_card_number')}
          fullWidth
          type={'number'}
          inputMode='numeric'
          value={cardFormData.cardNumber}
          name='cardNumber'
          onChange={(value) =>
            setCardFormData({ ...cardFormData, cardNumber: value as string })
          }
        />
        <div className={styles.flexContainer}>
          <EASSelect
            options={months}
            value={cardFormData.expiryMonth}
            label={textForKey('payment_valid_till')}
            onChange={handleExpirationMonthChange}
            labelId='expiryMonth'
          />
          <EASSelect
            options={years}
            value={cardFormData.expiryYear}
            onChange={handleExpirationYearChange}
            labelId='expiryYear'
            rootClass={styles.minWidthSelector}
          />
          <EASTextField
            fieldLabel={'CVV'}
            value={cardFormData.cvc}
            name='cvc'
            onChange={(value) =>
              setCardFormData({ ...cardFormData, cvc: value as string })
            }
          />
        </div>
        <Typography variant='h6' classes={{ root: styles.headline }}>
          {textForKey('payment_info_address')}
        </Typography>
        <EASSelect
          rootClass={styles.countrySelect}
          options={countries}
          value={addressFormData.country}
          label={textForKey('payment_country')}
          labelId={'country'}
          onChange={handleCountryChange}
        />
        <EASTextField
          fieldLabel={textForKey('payment_city')}
          fullWidth
          name='city'
          value={addressFormData.city}
          onChange={(value) =>
            setAddressFormData({ ...addressFormData, city: value as string })
          }
        />
        <EASTextField
          fieldLabel={textForKey('payment_address1')}
          fullWidth
          name='addressLine1'
          value={addressFormData.addressLine1}
          onChange={(value) =>
            setAddressFormData({
              ...addressFormData,
              addressLine1: value as string,
            })
          }
        />
        <EASTextField
          fieldLabel={textForKey('payment_address2')}
          fullWidth
          name='addressLine2'
          value={addressFormData.addressLine2}
          onChange={(value) =>
            setAddressFormData({
              ...addressFormData,
              addressLine2: value as string,
            })
          }
        />
        <div className={styles.flexWrapper}>
          <EASTextField
            fieldLabel={textForKey('payment_zip')}
            fullWidth
            name='zip'
            value={addressFormData.zip}
            onChange={(value) =>
              setAddressFormData({ ...addressFormData, zip: value as string })
            }
          />
          <EASTextField
            fieldLabel={textForKey('payment_state')}
            fullWidth
            name='state'
            value={addressFormData.state}
            onChange={(value) =>
              setAddressFormData({ ...addressFormData, state: value as string })
            }
          />
        </div>
        <Box
          display='flex'
          justifyContent='space-between'
          marginTop={'1.5em'}
          alignItems={'center'}
        >
          <LoadingButton
            variant='contained'
            disabled={!isFormValid() || loading}
            isLoading={loading}
            type={'submit'}
          >
            {textForKey('submit')}
          </LoadingButton>
          <Typography variant='caption' classes={{ root: styles.headline }}>
            * {textForKey('payment_info_no_payment')}
          </Typography>
        </Box>
        {error && (
          <Typography variant='caption' classes={{ root: styles.error }}>
            {error}
          </Typography>
        )}
      </form>
    </Modal>
  );
};

export default NewCardModal;
