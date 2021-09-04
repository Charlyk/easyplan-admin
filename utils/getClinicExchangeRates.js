const getClinicExchangeRates = (currentClinic) => {
  const currencies = currentClinic.availableCurrencies || [];
  const clinicCurrency = currentClinic.allCurrencies?.find(
    (item) => item.id === currentClinic.currency,
  );
  if (clinicCurrency == null) {
    return currencies;
  }
  if (!currencies.some((it) => it.currency === clinicCurrency.id)) {
    currencies.unshift({
      currency: clinicCurrency.id,
      currencyName: clinicCurrency.name,
      value: 1,
    });
  }
  return currencies;
}

export default getClinicExchangeRates;
