const valueToNumber = (newValue) => {
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

    newValue = parseInt(newValue, 10);
  }

  if (newValue < 0) {
    newValue = 0;
  }

  return newValue;
};

export default valueToNumber;
