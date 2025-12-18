import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resetFilter: false,
  tripsData: [],
  deletedData: [],
  paginationData: {},
  loading: false,

};

const providerSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    resetFilter: (state, action) => {
      state.resetFilter = action.payload;
    },
    paginationData: (state, action) => {
      state.paginationData = action.payload;
    },
    tripsData: (state, action) => {
      state.tripsData = action.payload;
    },
    tripDataAfterDelete: (state, action) => {
      const idToDelete = action.payload;

      state.tripsData = state.tripsData.map((item) => {
        if (item.single_trip && item.single_trip.id === idToDelete) {
          return null; // remove entire single trip group
        }

        if (item.round_trip) {
          const filteredRound = item.round_trip.filter((trip) => trip.id !== idToDelete);
          if (filteredRound.length === 0) return null;
          return { ...item, round_trip: filteredRound };
        }

        if (item.shared_trip) {
          const filteredShared = item.shared_trip.filter((trip) => trip.id !== idToDelete);
          if (filteredShared.length === 0) return null;
          return { ...item, shared_trip: filteredShared };
        }

        return item;
      }).filter(Boolean);
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

      // Loop through tripsData (which can contain nested trip types)
      state.tripsData = state.tripsData.map((item) => {
        if (item.single_trip && item.single_trip.id === id) {
          return {
            ...item,
            single_trip: { ...item.single_trip, trip_status: status },
          };
        }

        if (item.round_trip) {
          return {
            ...item,
            round_trip: item.round_trip.map((trip) =>
              trip.id === id ? { ...trip, trip_status: status } : trip
            ),
          };
        }

        if (item.shared_trip) {
          return {
            ...item,
            shared_trip: item.shared_trip.map((trip) =>
              trip.id === id ? { ...trip, trip_status: status } : trip
            ),
          };
        }

        return item;
      });
    },

    loading: (state, action) => {
      state.loading = action.payload;
    },

    // Pending Trips
    tripDataAfterApprove: (state, action) => {
      const idsToDelete = action.payload.map(id => Number(id));

      state.tripsData = state.tripsData
        .map((item) => {
          if (item.single_trip && idsToDelete.includes(item.single_trip.id)) {
            return null;
          }
          if (item.round_trip) {
            const filteredRound = item.round_trip.filter(
              (trip) => !idsToDelete.includes(trip.id)
            );
            if (filteredRound.length === 0) return null;
            return { ...item, round_trip: filteredRound };
          }
          return item;
        })
        .filter(Boolean);
    },
    updatePendingStatusAndRemove: (state, action) => {
      const { id, other_trip_id, status } = action.payload;

      state.tripsData = state.tripsData
        .map((item) => {
          if (
            item.single_trip &&
            (item.single_trip.id === id || item.single_trip.id === other_trip_id)
          ) {
            return null;
          }
          if (item.round_trip) {
            const updatedRound = item.round_trip.map((trip) =>
              trip.id === id ? { ...trip, trip_status: status } : trip
            );
            const filteredRound = updatedRound.filter(
              (trip) => trip.id !== id && trip.id !== other_trip_id
            );

            if (filteredRound.length === 0) return null;

            return { ...item, round_trip: filteredRound };
          }

          return item;
        })
        .filter(Boolean);
    },
    pendingTripDataAfterDelete: (state, action) => {
      const idToDelete = action.payload;

      state.tripsData = state.tripsData
        .map((item) => {
          // Single trip
          if (item.single_trip && item.single_trip.id === idToDelete) {
            return null; // remove it completely
          }

          // Round trip
          if (item.round_trip) {
            const remainingTrips = item.round_trip.filter((trip) => trip.id !== idToDelete);

            if (remainingTrips.length === 0) {
              // Both trips deleted → remove entire item
              return null;
            }

            if (remainingTrips.length === 1) {
              // Only one trip left → convert it to single_trip
              return {
                single_trip: remainingTrips[0]
              };
            }

            // More than one remaining → keep as round_trip
            return { ...item, round_trip: remainingTrips };
          }

          return item;
        })
        .filter(Boolean);
    },

  },
});

export const { resetFilter, tripsData, deletedData, restoreData, restoreMultipleData, tripDataAfterDelete, paginationData, updateStatus, loading, tripDataAfterApprove, updatePendingStatusAndRemove, pendingTripDataAfterDelete } = providerSlice.actions;

export default providerSlice.reducer;
