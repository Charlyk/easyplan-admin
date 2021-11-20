const formattedNumber = (number) => {
  return Intl.NumberFormat('ro-RO').format(number)
};

export default formattedNumber;
