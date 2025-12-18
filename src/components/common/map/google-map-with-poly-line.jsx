import React, { useState, useEffect, useRef } from "react";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";

export default function GoogleMapWithPolyline({ location_points, distances, setDistances }) {
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
  const [markers, setMarkers] = useState([]);
  const [directions, setDirections] = useState(null);

  function loadMarkers() {
    const locations = [];

    location_points.forEach((point, index) => {
      // Pickup marker
      if (point.pickup?.latlng) {
        locations.push({
          name: `Pickup ${index + 1}: ${point.pickup.address}`,
          position: point.pickup.latlng,
        });
      }

      // Dropoff marker
      if (point.dropoff?.latlng) {
        locations.push({
          name: `Dropoff ${index + 1}: ${point.dropoff.address}`,
          position: point.dropoff.latlng,
        });
      }
    });

    setMarkers(locations);
    if (locations.length > 1) {
      drawRoute(locations);
      calculateDistances(location_points);
    }
  }

  function drawRoute(locations) {
    if (!window.google) return;

    const adjusted = [...locations];
    const first = adjusted[0]?.position;
    const last = adjusted[adjusted.length - 1]?.position;

    if (first && last && first.lat === last.lat && first.lng === last.lng) {
      adjusted[adjusted.length - 1].position = {
        lat: last.lat + 0.0001,
        lng: last.lng + 0.0001,
      };
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: adjusted[0].position,
        destination: adjusted[adjusted.length - 1].position,
        waypoints: adjusted.slice(1, -1).map((loc) => ({
          location: loc.position,
          stopover: true,
        })),
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }

  function calculateDistances(points) {
    const calculated = points.map((point) => ({
      from: point.pickup?.address,
      to: point.dropoff?.address,
      distance: `${point.details?.distance} miles`,
      duration: point.details?.duration,
    }));
    setDistances(calculated);
  }

  useEffect(() => {
    loadMarkers();
  }, [location_points]);

  return (
    <APIProvider apiKey={apiKey} libraries={["places"]}>
      <Map
        style={{ width: "100%", height: "500px" }}
        defaultCenter={{ lat: 43.5785601, lng: -116.1734114 }}
        defaultZoom={12}
        gestureHandling="greedy"
        disableDefaultUI={true}
      >
        <MarkersWithFit markers={markers} />

        {directions && <MultiColorPolyline directions={directions} />}
      </Map>

      <div className="p-4">
        <h3 className="font-semibold text-lg">Distances & Durations:</h3>
        <ul className="list-disc pl-5">
          {distances.map((d, index) => (
            <li key={index} className="mb-2">
              From <strong>{d.from}</strong> to <strong>{d.to}</strong>: <br />
              🚗 <b>{d.distance}</b> – 🕒 <b>{d.duration}</b>
            </li>
          ))}
        </ul>
      </div>
    </APIProvider>
  );
}

function MarkersWithFit({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (!map || markers.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach((marker) => bounds.extend(marker.position));
    map.fitBounds(bounds); // Auto zoom & center to fit all markers
  }, [map, markers]);

  return (
    <>
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position} title={marker.name} />
      ))}
    </>
  );
}

function MultiColorPolyline({ directions }) {
  const map = useMap();
  const polylinesRef = useRef([]);

  useEffect(() => {
    if (!map || !window.google || !directions?.routes?.[0]) return;

    polylinesRef.current.forEach((poly) => poly.setMap(null));
    polylinesRef.current = [];

    const colors = ["#0b9965", "#007bff", "#f39c12", "#e74c3c", "#9b59b6", "#1abc9c"];

    directions.routes[0].legs.forEach((leg, index) => {
      const path = [];
      leg.steps.forEach((step) => step.path.forEach((p) => path.push(p)));

      const polyline = new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: colors[index % colors.length],
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map,
      });

      polylinesRef.current.push(polyline);
    });

    return () => {
      polylinesRef.current.forEach((poly) => poly.setMap(null));
    };
  }, [map, directions]);

  return null;
}
