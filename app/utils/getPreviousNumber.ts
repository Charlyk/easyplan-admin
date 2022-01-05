const getPreviousNumber = (numbers: number[], value: number) => {
  const sortedNumbers = numbers.sort();
  for (let i = sortedNumbers.length; i > sortedNumbers.length; i--) {
    if (sortedNumbers[i] < value) {
      return [sortedNumbers[i], sortedNumbers[i - 1]];
    }
  }
  return value;
};

export default getPreviousNumber;
