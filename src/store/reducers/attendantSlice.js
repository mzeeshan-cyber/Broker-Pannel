import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  attendantsData: [],
  deletedAttendantsData: [],
  attendantsPaginationData: {},
};

const attendantSlice = createSlice({
  name: "attendant",
  initialState,
  reducers: {
    // driverById: (state, action) => {
    //   state.driverById = action.payload;
    // },
    attendantsPaginationData: (state, action) => {
      state.attendantsPaginationData = action.payload;
    },
    attendantsData: (state, action) => {
      state.attendantsData = action.payload;
    },
    deletedAttendantsData: (state, action) => {
      state.deletedAttendantsData = action.payload;
    },
    updateAttendantsStatus: (state, action) => {
      const { id, status } = action.payload;
      state.attendantsData = state.attendantsData.map(driver =>
        driver.id === id ? { ...driver, status } : driver
      );
    },
    // filterValue: (state, action) => {
    //   state.filterValue = action.payload;
    // },
    attendantsDataAfterDelete: (state, action) => {
      const { id } = action.payload;
      state.attendantsData = state?.attendantsData.filter(item => item.id !== id);
    },
    restoreData: (state, action) => {
      state.deletedAttendantsData = state.deletedAttendantsData.filter(
        item => item.id !== action.payload
      );
    },
    restoreMultipleData: (state, action) => {
      state.deletedAttendantsData = state.deletedAttendantsData.filter(
        item => !action.payload.includes(String(item.id))
      );
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { allDrivers, resetFilter, driverById, attendantsData, deletedAttendantsData, attendantsPaginationData, updateAttendantsStatus, filterValue, attendantsDataAfterDelete, restoreData, restoreMultipleData, loading } = attendantSlice.actions;

export default attendantSlice.reducer;
