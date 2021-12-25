const getNextNumber = (numbers: number[], value: number) => {
  const sortedNumbers = numbers.sort();
  for (let i = 0; i < sortedNumbers.length; i++) {
    if (sortedNumbers[i] > value) {
      return sortedNumbers[i];
    }
  }
  return value;
};

export default getNextNumber;
