import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allDrivers: [],
  resetFilter: false,
  driverById: {},
  driversData:[],
  deletedDriversData:[],
  driversPaginationData:{},
  filterValue:{}

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
  },
});

export const { allDrivers, resetFilter, driverById, driversData, deletedDriversData, driversPaginationData, updateDriverStatus, filterValue } = driverSlice.actions;

export default driverSlice.reducer;
