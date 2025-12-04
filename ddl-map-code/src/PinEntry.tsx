import React, { useState } from "react";
import "./pin.css";

interface PinEntryProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function appendCsvRow(row: string[]) {
  const csvLine = row.map((v) => `"${v.replace(/"/g, '""')}"`).join(",") + "\n";
  const blob = new Blob([csvLine], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pins.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function PinEntry({ open, setOpen }: PinEntryProps) {
  const [form, setForm] = useState<Record<string, string>>({
    lat: "",
    lon: "",
    date: "",
    time: "",
    location: "",
    make: "",
    license: "",
    report: "",
    picture: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    appendCsvRow(Object.values(form));
    setForm({
      lat: "",
      lon: "",
      date: "",
      time: "",
      location: "",
      make: "",
      license: "",
      report: "",
      picture: "",
    });
    setOpen(false);
  };

  return (
    <div className="pin-entry">
      {!open && (
        <button onClick={() => setOpen(true)} className="pin-entry-button">
          Enter ICE Sighting Info
        </button>
      )}

      {open && (
        <div className="pin-entry-form">
          <div className="form-grid">
            {Object.keys(form).map((field) => (
              <div key={field} className="form-field">
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {field === "report" ? (
                  <textarea
                    id={field}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    rows={4}
                    className="pin-entry-input"
                  />
                ) : (
                  <input
                    id={field}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="pin-entry-input"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button onClick={handleSubmit} className="pin-entry-button">
              Save
            </button>
            <button onClick={() => setOpen(false)} className="pin-entry-button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
