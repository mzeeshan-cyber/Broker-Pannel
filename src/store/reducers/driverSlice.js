import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allDrivers: [],
  resetFilter: false,
  loading: false,
  driverById: {},
  driversData: [],
  deletedDriversData: [],
  driversPaginationData: {},
  filterValue: {}
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    allDrivers: (state, action) => {
      state.allDrivers = action.payload;
    },
    resetFilter: (state, action) => {
      state.resetFilter = action.payload;
    },
    driverById: (state, action) => {
      state.driverById = action.payload;
    },
    driversPaginationData: (state, action) => {
      state.driversPaginationData = action.payload;
    },
    driversData: (state, action) => {
      state.driversData = action.payload;
    },
    deletedDriversData: (state, action) => {
      state.deletedDriversData = action.payload;
    },
    updateDriverStatus: (state, action) => {
      const { id, status } = action.payload;
      state.driversData = state.driversData.map(driver =>
        driver.id === id ? { ...driver, status } : driver
      );
    },
    filterValue: (state, action) => {
      state.filterValue = action.payload;
    },
    driversDataAfterDelete: (state, action) => {
      const { id } = action.payload;
      state.driversData = state?.driversData.filter(item => item.id !== id);
    },
    restoreData: (state, action) => {
      state.deletedDriversData = state.deletedDriversData.filter(
        item => item.id !== action.payload
      );
    },
    restoreMultipleData: (state, action) => {
      state.deletedDriversData = state.deletedDriversData.filter(
        item => !action.payload.includes(String(item.id))
      );
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { allDrivers, resetFilter, driverById, driversData, deletedDriversData, driversPaginationData, updateDriverStatus, filterValue, driversDataAfterDelete, restoreData, restoreMultipleData, loading } = driverSlice.actions;

export default driverSlice.reducer;
