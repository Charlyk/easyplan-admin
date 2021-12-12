import types from '../types';

export function setIsExchangeRatesModalOpen(isOpen) {
  return {
    type: types.setExchangeRateModalOpen,
    payload: isOpen,
  };
}
