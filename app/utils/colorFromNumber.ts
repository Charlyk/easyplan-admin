const colorFromNumber = (value: number) => {
  const numbers = String(value).split('');
  return `rgb(${numbers.map((_) => (Math.random() * 256) | 0)})`;
};

export default colorFromNumber;
