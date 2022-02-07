import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from 'redux/initialState';
import { MoizvonkiConnection } from 'types';
import { ConnectMoizvonkiRequest } from 'types/api';

const moizvonkiIntegrationSlice = createSlice({
  name: 'moizvonkiIntegration',
  initialState: initialState.moizvonkiConnection,
  reducers: {
    dispatchFetchConnectionInfo(state) {
      state.isLoading = true;
    },
    dispatchUpdateConnection(
      state,
      _action: PayloadAction<ConnectMoizvonkiRequest>,
    ) {
      state.isLoading = true;
    },
    dispatchRemoveConnection(state) {
      state.connection = null;
      state.isLoading = true;
    },
    setMoizvonkiConnection(state, action: PayloadAction<MoizvonkiConnection>) {
      state.connection = action.payload;
      state.isLoading = false;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  dispatchFetchConnectionInfo,
  dispatchRemoveConnection,
  dispatchUpdateConnection,
  setMoizvonkiConnection,
  setIsLoading,
} = moizvonkiIntegrationSlice.actions;

export default moizvonkiIntegrationSlice.reducer;
