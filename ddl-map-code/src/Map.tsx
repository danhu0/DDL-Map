import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import Papa from "papaparse";

const heatIcon = L.divIcon({
  className: 'heat-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface Pin {
  lat: number;
  lon: number;
  date: string;
  time: string;
  location: string;
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

    L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.png', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    pins.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lon], { icon: heatIcon }).addTo(map);

      // React-friendly event handler
      marker.on("click", () => {
        setSelectedPin(pin);
      });
    });

    //feature to implement: access multiple data sets when there's overlapping coordinates 

    return () => { map.remove(); };
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
          <p><strong>Location:</strong> {selectedPin.location}</p>
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
