import { useSelector as _useSelector, TypedUseSelectorHook } from 'react-redux';
import { ReduxState } from 'redux/types';

export const useSelector: TypedUseSelectorHook<ReduxState> = _useSelector;
