import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allPayees: [],
  resetFilter: false,
  payeeById: {},
  payeesData:[],
  deletedPayeesData:[],
  payeesPaginationData:{},

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
    }  
  },
});

export const { allPayees, resetFilter, payeeById, payeesData, deletedPayeesData, payeesPaginationData, updatePayeeStatus } = payeeSlice.actions;

export default payeeSlice.reducer;
