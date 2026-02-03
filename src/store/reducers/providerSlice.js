import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProviders: [],
  resetFilter: false,
  providerById: {},
  filterValue: {},
  providerData: [],
  deletedProviderData: [],
  providerPaginationData: {},
  loading: false,

};

const providerSlice = createSlice({
  name: "provider",
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
    providerPaginationData: (state, action) => {
      state.providerPaginationData = action.payload;
    },
    providerData: (state, action) => {
      state.providerData = action.payload;
    },
    deletedProviderData: (state, action) => {
      state.deletedProviderData = action.payload;
    },
    updateProviderStatus: (state, action) => {
      const { id, status } = action.payload;
      state.providerData = state.providerData.map(provider =>
        provider.id === id ? { ...provider, status } : provider
      );
    },
    providersDataAfterDelete: (state, action) => {
      const { id } = action.payload;
      state.providerData = state?.providerData.filter(item => item.id !== id);
    },
    filterValue: (state, action) => {
      state.filterValue = action.payload;
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
    restoreData: (state, action) => {
      state.deletedProviderData = state.deletedProviderData.filter(
        item => item.id !== action.payload
      );
    },
    restoreMultipleData: (state, action) => {
      state.deletedProviderData = state.deletedProviderData.filter(
        item => !action.payload.includes(String(item.id))
      );
    },
  },
});

export const { allProviders, resetFilter, providerById, providerData, deletedProviderData, providerPaginationData, updateProviderStatus, loading, filterValue, providersDataAfterDelete, restoreData, restoreMultipleData } = providerSlice.actions;

export default providerSlice.reducer;
