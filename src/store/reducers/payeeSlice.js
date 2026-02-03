import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allPayees: [],
  resetFilter: false,
  loading: false,
  payeeById: {},
  payeesData: [],
  deletedPayeesData: [],
  payeesPaginationData: {},

};

const payeeSlice = createSlice({
  name: "payee",
  initialState,
  reducers: {
    allPayees: (state, action) => {
      state.allPayees = action.payload;
    },
    resetFilter: (state, action) => {
      state.resetFilter = action.payload;
    },
    payeeById: (state, action) => {
      state.payeeById = action.payload;
    },
    payeesPaginationData: (state, action) => {
      state.payeesPaginationData = action.payload;
    },
    payeesData: (state, action) => {
      state.payeesData = action.payload;
    },
    deletedPayeesData: (state, action) => {
      state.deletedPayeesData = action.payload;
    },
    updatePayeeStatus: (state, action) => {
      const { id, status } = action.payload;
      state.payeesData = state.payeesData.map(payee =>
        payee.id === id ? { ...payee, status } : payee
      );
    },
    payeeDataAfterDelete: (state, action) => {
      const { id } = action.payload;
      state.payeesData = state?.payeesData.filter(item => item.id !== id);
    },
    filterValue: (state, action) => {
      state.filterValue = action.payload;
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
    restoreData: (state, action) => {
      state.deletedPayeesData = state.deletedPayeesData.filter(
        item => item.id !== action.payload
      );
    },
    restoreMultipleData: (state, action) => {
      state.deletedPayeesData = state.deletedPayeesData.filter(
        item => !action.payload.includes(String(item.id))
      );
    },
  },
});

export const { allPayees, resetFilter, payeeById, payeesData, deletedPayeesData, payeesPaginationData, updatePayeeStatus, payeeDataAfterDelete, loading, restoreData, restoreMultipleData } = payeeSlice.actions;

export default payeeSlice.reducer;
