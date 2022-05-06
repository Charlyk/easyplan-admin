import { currenciesMap } from './constants';
import formattedAmount from './formattedAmount';

const formatAmountWithSymbol = (amount: number, currency: string): string => {
  const rawAmount = formattedAmount(amount, currency);
  const currencySymbol = currenciesMap[currency];
  if (!currencySymbol) {
    return rawAmount;
  }
  return rawAmount.replace(currency.toUpperCase(), currencySymbol);
};

export default formatAmountWithSymbol;
