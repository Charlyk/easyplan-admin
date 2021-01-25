import types from '../types/types';

export function setIsExchangeRatesModalOpen(isOpen) {
  return {
    type: types.setExchangeRateModalOpen,
    payload: isOpen,
  };
}
