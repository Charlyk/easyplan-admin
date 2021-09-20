import moment from "moment-timezone";
import { createSlice } from "@reduxjs/toolkit";

export const filterAvailableTime = (availableTime, startTime) => {
  return availableTime.filter((item) => {
    const [startH, startM] = startTime.split(':');
    const [h, m] = item.split(':');
    const startDate = moment().set({
      hour: parseInt(startH),
      minute: parseInt(startM),
      second: 0,
    });
    const endDate = moment().set({
      hour: parseInt(h),
      minute: parseInt(m),
      second: 0,
    });
    const diff = Math.ceil(endDate.diff(startDate) / 1000 / 60);
    return diff >= 15;
  });
};

export const initialState = {
  showDatePicker: false,
  pauseDate: new Date(),
  startHour: '',
  endHour: '',
  comment: '',
  isLoading: false,
  availableAllTime: [],
  availableStartTime: [],
  availableEndTime: [],
  isFetchingHours: false,
  isDeleting: false,
};

const addPauseModalSlice = createSlice({
  name: 'addPauseModal',
  initialState,
  reducers: {
    setShowDatePicker(state, action) {
      state.showDatePicker = action.payload;
    },
    setPauseDate(state, action) {
      state.pauseDate = action.payload;
    },
    setStartHour(state, action) {
      const startHour = action.payload;
      const endHour = state.endHour;
      const availableEndTime = filterAvailableTime(
        state.availableAllTime,
        startHour,
      );
      state.startHour = startHour;
      state.availableEndTime = availableEndTime;
      state.endHour = availableEndTime.includes(endHour)
        ? endHour
        : availableEndTime.length > 0
          ? availableEndTime[0]
          : '';
    },
    setEndHour(state, action) {
      state.endHour = action.payload;
    },
    setComment(state, action) {
      state.comment = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setAvailableAllTime(state, action) {
      const availableAllTime = action.payload;
      const startHour =
        availableAllTime?.length > 0 && state.startHour.length === 0
          ? availableAllTime[0]
          : state.startHour;
      const availableStartTime = availableAllTime;
      const availableEndTime = filterAvailableTime(availableAllTime, startHour);

      state.availableAllTime = availableAllTime;
      state.availableStartTime = availableStartTime;
      state.availableEndTime = availableEndTime;
      state.startHour = startHour;
    },
    setAvailableStartTime(state, action) {
      state.availableStartTime = action.payload;
    },
    setAvailableEndTime(state, action) {
      state.availableEndTime = action.payload;
    },
    setIsFetchingHours(state, action) {
      state.isFetchingHours = action.payload;
    },
    setIsDeleting(state, action) {
      state.isDeleting = action.payload;
    },
  },
});

export const {
  setAvailableStartTime,
  setShowDatePicker,
  setComment,
  setIsLoading,
  setIsDeleting,
  setEndHour,
  setIsFetchingHours,
  setPauseDate,
  setStartHour,
  setAvailableAllTime,
  setAvailableEndTime,
} = addPauseModalSlice.actions;

export default addPauseModalSlice.reducer;
