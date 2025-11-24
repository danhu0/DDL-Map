import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

const Map = () => {
  useEffect(() => {
    const map = L.map("map").setView([41.8246, -71.4142], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map"></div>;
};

export default Map;
