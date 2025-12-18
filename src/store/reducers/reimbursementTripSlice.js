import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProviders: [],
  resetFilter: false,
  providerById: {},
  reimbursementTripData: [],
  deletedData: [],
  paginationData: {},
  loading: false,

};

const providerSlice = createSlice({
  name: "reimbursementtrip",
  initialState,
  reducers: {
    allProviders: (state, action) => {
      state.allProviders = action.payload;
    },
    resetFilter: (state, action) => {
      state.resetFilter = action.payload;
    },
    providerById: (state, action) => {
      state.providerById = action.payload;
    },
    paginationData: (state, action) => {
      state.paginationData = action.payload;
    },
    reimbursementTripData: (state, action) => {
      state.reimbursementTripData = action.payload;
    },
    reimbursementTripDataAfterDelete: (state, action) => {
      state.reimbursementTripData = state.reimbursementTripData.filter(
        item => item.id !== action.payload
      );
    },
    deletedData: (state, action) => {
      state.deletedData = action.payload;
    },
    restoreData: (state, action) => {
      state.deletedData = state.deletedData.filter(
        item => item.id !== action.payload
      );
    },
    restoreMultipleData: (state, action) => {
      state.deletedData = state.deletedData.filter(
        item => !action.payload.includes(String(item.id)) 
      );
    },
    updateStatus: (state, action) => {
      const { id, status } = action.payload;
      state.reimbursementTripData = state.reimbursementTripData.map(trip =>
        trip.id === id ? { ...trip, tripStatus: status } : trip
      );
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { allProviders, resetFilter, providerById, reimbursementTripData, deletedData, restoreData, restoreMultipleData, reimbursementTripDataAfterDelete, paginationData, updateStatus, loading } = providerSlice.actions;

export default providerSlice.reducer;
