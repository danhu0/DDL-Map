import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import Papa from "papaparse";

const heatIcon = L.divIcon({
  className: "heat-marker",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface Pin {
  lat: number;
  lon: number;
  date: string;   // e.g. "09-06-2025"
  time: string;   // e.g. "9:12AM"
  location: string;
  license: string;
  picture: string;
  make: string;
  report: string;
}

// Convert "9:12AM" / "3:09PM" to minutes from midnight (0–1439)
const parseTimeToMinutes = (timeStr: string): number => {
  const t = timeStr.trim().toUpperCase();
  const match = t.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
  if (!match) return 0;

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3];

  if (period === "AM") {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }

  return hour * 60 + minute;
};

const minutesToTimeLabel = (minutes: number): string => {
  minutes = Math.max(0, Math.min(1439, minutes));
  let hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  const period = hour >= 12 ? "PM" : "AM";
  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour = hour - 12;
  }

  const minuteStr = minute.toString().padStart(2, "0");
  return `${hour}:${minuteStr} ${period}`;
};

const Map = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [filteredPins, setFilteredPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  // Date filter
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");

  // Time-of-day filter (minutes from midnight)
  const [timeMin, setTimeMin] = useState<number>(0);
  const [timeMax, setTimeMax] = useState<number>(1439);

  // License plate search
  const [licenseQuery, setLicenseQuery] = useState<string>("");

  useEffect(() => {
    Papa.parse("/cars.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const data = results.data as Pin[];
        setPins(data);
        setFilteredPins(data);
      },
    });
  }, []);

  // Apply date + time + license filtering
  useEffect(() => {
    if (pins.length === 0) {
      setFilteredPins([]);
      return;
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Guardrail: invalid date range
    if (start && end && end < start) {
      setDateError("End date cannot be before start date.");
      return;
    } else {
      setDateError("");
    }

    const query = licenseQuery.trim().toLowerCase();

    const newFiltered = pins.filter((pin) => {
      // Date filter
      const pinDate = new Date(pin.date);
      if (start && pinDate < start) return false;
      if (end && pinDate > end) return false;

      // Time filter
      const pinMinutes = parseTimeToMinutes(pin.time);
      if (pinMinutes < timeMin) return false;
      if (pinMinutes > timeMax) return false;

      // License filter (partial, case-insensitive)
      if (query) {
        const license = (pin.license || "").toLowerCase();
        if (!license.includes(query)) return false;
      }

      return true;
    });

    setFilteredPins(newFiltered);
  }, [startDate, endDate, timeMin, timeMax, licenseQuery, pins]);

  useEffect(() => {
    const map = L.map("map").setView([41.8246, -71.4142], 13);

    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.png",
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map);

    map.on("click", () => setSelectedPin(null));

    filteredPins.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lon], { icon: heatIcon }).addTo(map);

      marker.on("click", (e: any) => {
        e.originalEvent?.stopPropagation();
        setSelectedPin(pin);
      });
    });

    return () => {
      map.remove();
    };
  }, [filteredPins]);

  const handleTimeMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setTimeMin(Math.min(value, timeMax));
  };

  const handleTimeMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setTimeMax(Math.max(value, timeMin));
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setDateError("");
    setTimeMin(0);
    setTimeMax(1439);
    setLicenseQuery("");
  };

  return (
    <>
      {/* Nicely formatted filter/search box */}
      <div className="filter-box">
        <h2 className="filter-title">Search & Filters</h2>

        {/* License search */}
        <div className="filter-row">
          <label className="filter-label">
            License plate:
            <input
              type="text"
              className="filter-input"
              placeholder="e.g. 2JF 771 or 2JF"
              value={licenseQuery}
              onChange={(e) => setLicenseQuery(e.target.value)}
            />
          </label>
        </div>

        {/* Date range */}
        <div className="filter-row">
          <div className="filter-group">
            <span className="filter-label">Date range:</span>
            <div className="filter-inline">
              <label>
                From:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label>
                To:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Time-of-day range */}
        <div className="filter-row">
          <div className="filter-group">
            <span className="filter-label">
              Time of day: {minutesToTimeLabel(timeMin)} – {minutesToTimeLabel(timeMax)}
            </span>
            <div className="time-sliders">
              <input
                type="range"
                min={0}
                max={1439}
                value={timeMin}
                onChange={handleTimeMinChange}
              />
              <input
                type="range"
                min={0}
                max={1439}
                value={timeMax}
                onChange={handleTimeMaxChange}
              />
            </div>
          </div>
        </div>

        {/* Status + reset */}
        <div className="filter-row filter-footer">
          {dateError && <p className="error-message">{dateError}</p>}
          <button className="reset-button" onClick={resetFilters}>
            Reset all filters
          </button>
          <span className="results-count">
            Showing {filteredPins.length} result{filteredPins.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div id="map"></div>

      {selectedPin && (
        <div className="sidebar">
          <button className="close-btn" onClick={() => setSelectedPin(null)}>
            ✕
          </button>

          <div className="sidebar-content">
            {selectedPin.picture && (
              <img
                src={selectedPin.picture}
                alt="Car"
                className="sidebar-image"
              />
            )}

            <h2>Car Info</h2>
            <p>
              <strong>Date:</strong> {selectedPin.date}
            </p>
            <p>
              <strong>Time:</strong> {selectedPin.time}
            </p>
            <p>
              <strong>Location:</strong> {selectedPin.location}
            </p>
            <p>
              <strong>Make:</strong> {selectedPin.make}
            </p>
            <p>
              <strong>License:</strong> {selectedPin.license}
            </p>
            <p>
              <strong>Report:</strong> {selectedPin.report}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Map;
