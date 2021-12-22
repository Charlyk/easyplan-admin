import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PubnubMessage } from 'types';

const pubnubMessagesSlice = createSlice({
  name: 'pubnubMessages',
  initialState: { message: null },
  reducers: {
    handleRemoteMessageReceived(state, action: PayloadAction<PubnubMessage>) {
      state.message = action.payload;
    },
  },
});

export const { handleRemoteMessageReceived } = pubnubMessagesSlice.actions;

export default pubnubMessagesSlice.reducer;
