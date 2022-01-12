// import { createSelector } from 'reselect';
import { ReduxState } from 'redux/types';

export const changeLogModalSelector = (state: ReduxState) =>
  state.changeLogModal;
