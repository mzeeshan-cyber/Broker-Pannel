import { Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CircularLoader from "../loader/CircularLoader";

export default function DirectionsMap({ data }) {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Safely get coordinates
  const pickup = data?.pickup?.latlng;
  const dropoff = data?.dropoff?.latlng;

  useEffect(() => {
    if (!window.google) return;
    if (!pickup || !dropoff) return; // Exit if data not ready

    // Map is about to load, keep loader
    setLoading(true);

    const isSameLocation =
      pickup.lat === dropoff.lat && pickup.lng === dropoff.lng;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: isSameLocation ? 15 : 5,
      center: pickup,
    });

    // Always add pickup marker
    new window.google.maps.Marker({
      position: pickup,
      map,
      label: "P",
      title: isSameLocation ? "Pickup & Dropoff" : "Pickup",
    });

    if (!isSameLocation) {
      // Add dropoff marker
      new window.google.maps.Marker({
        position: dropoff,
        map,
        label: "D",
        title: "Dropoff",
      });

      // Draw directions route
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: { strokeColor: "#007bff", strokeWeight: 4 },
      });

      directionsService.route(
        {
          origin: pickup,
          destination: dropoff,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Directions request failed:", status);
          }
          // Map loaded
          setLoading(false);
        }
      );
    } else {
      // Map loaded for same location
      setLoading(false);
    }
  }, [pickup, dropoff]);

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      {loading && (
        <CircularLoader text="please wait map loading..." height="40vh" />
      )}
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100%", borderRadius: "10px" }}
      />
    </div>
  );
}
