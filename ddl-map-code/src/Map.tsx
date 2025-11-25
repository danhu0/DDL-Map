import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Map = () => {
  useEffect(() => {
    const map = L.map("map").setView([41.8246, -71.4142], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([41.8223, -71.4107])
      .addTo(map)
      .bindPopup("<p>Time: Nov 17, 9:41AM<br>Liscence: Black Dodge ILJ, 621</p>");

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map"></div>;
};

export default Map;
