import { useDispatch as dispatchFunc } from 'react-redux';
import { ReduxDispatch } from 'store';

export const useDispatch = () => dispatchFunc<ReduxDispatch>();
