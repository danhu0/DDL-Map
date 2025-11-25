import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import Papa from "papaparse";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Pin {
  lat: number;
  lon: number;
  date: string;
  time: string;
  license: string;
}

const Map = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  useEffect(() => {
    // load CSV
    Papa.parse("/cars.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        console.log("Parsed CSV:", results.data);
        setPins(results.data as Pin[]);
      },
    });
  }, []);

  useEffect(() => {
    if (pins.length === 0) return;

    const map = L.map("map").setView([41.8246, -71.4142], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    pins.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lon]).addTo(map);

      // React-friendly event handler
      marker.on("click", () => {
        setSelectedPin(pin);
      });
    });

    return () => {map.remove();};
  }, [pins]);

  return (
    <>
      <div id="map"></div>

      {/* Sidebar */}
      {selectedPin && (
        <div className="sidebar">
          <button className="close-btn" onClick={() => setSelectedPin(null)}>
            ✕
          </button>

          <h2>Car Info</h2>
          <p><strong>Date:</strong> {selectedPin.date}</p>
          <p><strong>Time:</strong> {selectedPin.time}</p>
          <p><strong>License:</strong> {selectedPin.license}</p>

         
        </div>
      )}
    </>
  );
};





//     pins.forEach((pin) => {
//       L.marker([pin.lat, pin.lon])
//         .addTo(map)
//         .bindPopup(`<p>Date: ${pin.date}<br>Time: ${pin.time}<br>License: ${pin.license}</p>`);
//     });

//     return () => {
//       map.remove();
//     };
//   }, [pins]);

//   return <div id="map"></div>;
// };

export default Map;
