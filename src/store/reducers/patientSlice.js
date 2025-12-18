import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allPatients: [],
  filterValue: {},
  resetFilter: false,
  loading: false,
  patientById: {},
  patientsData: [],
  deletedPatientsData: [],
  patientsPaginationData: {},

};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    allPatients: (state, action) => {
      state.allPatients = action.payload;
    },
    filterValue: (state, action) => {
      state.filterValue = action.payload;
    },
    resetFilter: (state, action) => {
      state.resetFilter = action.payload;
    },
    patientById: (state, action) => {
      state.patientById = action.payload;
    },
    patientsPaginationData: (state, action) => {
      state.patientsPaginationData = action.payload;
    },
    patientsData: (state, action) => {
      state.patientsData = action.payload;
    },
    deletedPatientsData: (state, action) => {
      state.deletedPatientsData = action.payload;
    },
    patientsDataAfterDelete: (state, action) => {
      const { id } = action.payload;
      state.patientsData = state?.patientsData.filter(item => item.id !== id);
    },
    updatePatientStatus: (state, action) => {
      const { id, status } = action.payload;
      state.patientsData = state.patientsData.map(patient =>
        patient.id === id ? { ...patient, status } : patient
      );
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
    submitting: (state, action) => {
      state.submitting = action.payload;
    },
  },
});

export const { allPatients, resetFilter, filterValue, patientById, patientsData, deletedPatientsData, patientsPaginationData, patientsDataAfterDelete, updatePatientStatus, loading, submitting } = patientSlice.actions;

export default patientSlice.reducer;
