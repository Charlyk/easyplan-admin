import { useSelector as _useSelector, TypedUseSelectorHook } from 'react-redux';
import { ReduxStateType } from 'store';

export const useSelector: TypedUseSelectorHook<ReduxStateType> = _useSelector;
