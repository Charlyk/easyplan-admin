import types from 'redux/types';

export function setIsExchangeRatesModalOpen(isOpen) {
  return {
    type: types.setExchangeRateModalOpen,
    payload: isOpen,
  };
}
