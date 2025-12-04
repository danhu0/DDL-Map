// import React, { useState } from "react";
// import "/pin.css"

// // Simple CSV appending helper (client-side download)
// function appendCsvRow(row: string[]) {
//   const csvLine = row.map((v) => `"${v.replace(/"/g, '""')}"`).join(",") + "\n";

//   // Create a downloadable blob
//   const blob = new Blob([csvLine], { type: "text/csv" });
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "pins.csv"; // This will create/download updated CSV
//   a.click();

//   URL.revokeObjectURL(url);
// }

// export default function PinEntry() {
//   const [open, setOpen] = useState(false);
//   const [form, setForm] = useState({
//     lat: "",
//     lon: "",
//     date: "",
//     time: "",
//     location: "",
//     make: "",
//     license: "",
//     report: "",
//     picture: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     appendCsvRow([
//       form.lat,
//       form.lon,
//       form.date,
//       form.time,
//       form.location,
//       form.make,
//       form.license,
//       form.report,
//       form.picture,
//     ]);

//     setForm({
//       lat: "",
//       lon: "",
//       date: "",
//       time: "",
//       location: "",
//       make: "",
//       license: "",
//       report: "",
//       picture: "",
//     });

//     setOpen(false);
//   };

//   return (
//     <div style={{ padding: "1rem", fontFamily: "Courier New, monospace" }}>
//       {!open && (
//         <button
//           onClick={() => setOpen(true)}
//           style={{
//             padding: "0.75rem 1.5rem",
//             borderRadius: "12px",
//             cursor: "pointer",
//           }}
//         >
//           Enter ICE Sighting Info
//         </button>
//       )}

//       {open && (
//         <div
//           style={{
//             marginTop: "1rem",
//             padding: "1rem",
//             borderRadius: "12px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//           }}
//         >
//           <div style={{ display: "grid", gap: "1rem" }}>
//             {Object.keys(form).map((field) => (
//               <div key={field} style={{ display: "grid", gap: "0.25rem" }}>
//                 <label htmlFor={field}>
//                   {field.charAt(0).toUpperCase() + field.slice(1)}
//                 </label>
//                 {field === "report" ? (
//                   <textarea
//                     id={field}
//                     name={field}
//                     value={form[field]}
//                     onChange={handleChange}
//                     rows={4}
//                     style={{ padding: "0.5rem", borderRadius: "8px" }}
//                   />
//                 ) : (
//                   <input
//                     id={field}
//                     name={field}
//                     value={form[field]}
//                     onChange={handleChange}
//                     style={{ padding: "0.5rem", borderRadius: "8px" }}
//                   />
//                 )}
//               </div>
//             ))}

//             <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
//               <button
//                 onClick={handleSubmit}
//                 style={{
//                   padding: "0.75rem 1.5rem",
//                   borderRadius: "12px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Save
//               </button>

//               <button
//                 onClick={() => setOpen(false)}
//                 style={{
//                   padding: "0.75rem 1.5rem",
//                   borderRadius: "12px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState } from "react";
import "./pin.css"; // import the CSS file

// Simple CSV appending helper (client-side download)
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

export default function PinEntry() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    appendCsvRow([
      form.lat,
      form.lon,
      form.date,
      form.time,
      form.location,
      form.make,
      form.license,
      form.report,
      form.picture,
    ]);

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
        <button
          onClick={() => setOpen(true)}
          className="pin-entry-button"
        >
          Enter ICE Sighting Info
        </button>
      )}

      {open && (
        <div className="pin-entry-form">
          <div className="form-grid">
            {Object.keys(form).map((field) => (
              <div key={field} className="form-field">
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
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
