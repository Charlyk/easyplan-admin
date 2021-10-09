/**
 * Format number as price with currency
 * @param {number} amount
 * @param {string} currency
 * @return {string}
 */
const formattedAmount = (amount, currency) => {
  return Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: currency || 'MDL',
  }).format(amount);
};

export default formattedAmount;
