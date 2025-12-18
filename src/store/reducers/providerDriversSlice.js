import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  providerDriverData:[],
  providerDriverPaginationData:{},
  loading: false,
  resetFilter: false,

};

const providerDriverSlice = createSlice({
  name: "provider_drivers",
  initialState,
  reducers: {
    providerDriverPaginationData: (state, action) => {
      state.providerDriverPaginationData = action.payload;
    },
    providerDriverData: (state, action) => {
      state.providerDriverData = action.payload;
    },
    updateDriverProviderStatus: (state, action) => {
      const { id, status } = action.payload;
      state.providerDriverData = state.providerDriverData.map(provider =>
        provider.id === id ? { ...provider, status } : provider
      );
    },
    loading: (state, action) => {
        state.loading = action.payload;
    },
    resetFilter: (state, action) => {
        state.resetFilter = action.payload;
    },  
  },
});

export const {providerDriverData, providerDriverPaginationData, updateDriverProviderStatus, loading, resetFilter } = providerDriverSlice.actions;

export default providerDriverSlice.reducer;
