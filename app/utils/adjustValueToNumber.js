import roundToTwo from './roundToTwo';

const adjustValueToNumber = (value, maxAmount) => {
  let newValue = value;

  if (newValue == null) {
    newValue = 0;
  }
  if (typeof newValue === 'string') {
    if (newValue.length === 0) {
      newValue = '0';
    }

    if (newValue.length > 1 && newValue[0] === '0') {
      newValue = newValue.replace(/^0+/, '');
    }

    newValue = parseFloat(newValue);
  }

  if (newValue < 0) {
    newValue = 0;
  }

  if (newValue > maxAmount) {
    newValue = maxAmount;
  }
  return roundToTwo(newValue);
};

export default adjustValueToNumber;
