import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProviders: [],
  resetFilter: false,
  providerById: {},
  filterValue: {},
  tripsInvoicesData: [],
  deletedData: [],
  paginationData: {},
  loading: false,

};

const tripsInvoicesSlice = createSlice({
  name: "tripsInvoices",
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
    tripsInvoicesData: (state, action) => {
      state.tripsInvoicesData = action.payload;
    },
    tripsInvoicesAfterDelete: (state, action) => {
      state.tripsInvoicesData = state.tripsInvoicesData.filter(
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
      const { id, status, paid_date } = action.payload;
      state.tripsInvoicesData = state.tripsInvoicesData.map(trip =>
        trip.id === id ? { ...trip, status, paid_date } : trip
      );
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
    filterValue: (state, action) => {
      state.filterValue = action.payload;
    },
  },
});

export const { allProviders, resetFilter, providerById, tripsInvoicesData, deletedData, restoreData, restoreMultipleData, tripsInvoicesAfterDelete, paginationData, updateStatus, loading, filterValue } = tripsInvoicesSlice.actions;

export default tripsInvoicesSlice.reducer;
