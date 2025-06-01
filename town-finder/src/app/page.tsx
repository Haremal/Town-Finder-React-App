"use client";

import { useEffect, useState } from "react";

type Town = {
  id: number;
  town: string;
  pincode: string;
};

export default function Home() {
  const [towns, setTowns] = useState<Town[]>([]);
  const [town, setTown] = useState("");
  const [pincode, setPincode] = useState("");

  // Fetch towns
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/towns/")
        .then((res) => res.json())
        .then((data) => setTowns(data))
        .catch((err) => console.error(err));
  }, []);

  const [searchTown, setSearchTown] = useState("");
  const [searchPincode, setSearchPincode] = useState("");
  const searchTowns = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/towns/search/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ town: searchTown.trim(), pincode: searchPincode.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setTowns(data);
      } else {
        alert("Search failed");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Add town
  const addTown = async () => {
    // Check duplicates before sending request
    if (towns.some(t => t.town.toLowerCase() === town.trim().toLowerCase())) {
      alert("This town already exists.");
      return;
    }
    if (towns.some(t => t.pincode === pincode.trim())) {
      alert("This pincode is already assigned to a town.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/towns/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ town: town.trim(), pincode: pincode.trim() }),
      });

      const data = await res.json();
      console.log("Response:", res.status, data);

      if (res.ok) {
        setTowns([...towns, { id: data.id, town: town.trim(), pincode: pincode.trim() }]);
        setTown("");
        setPincode("");
      } else {
        alert("Failed to add: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add town.");
    }
  };

  // Delete town
  const deleteTown = async (id: number) => {
    const res = await fetch(`http://localhost:8000/api/towns/delete/${id}/`, {
      method: "DELETE",
    });
    if (res.ok) {
      setTowns(towns.filter((t) => t.id !== id));
    }
  };

  return (
      <main
          style={{
            maxWidth: 480,
            margin: "2rem auto",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            color: "#222",
          }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>Towns</h1>

        <section style={{ marginBottom: "2rem" }}>
          <h2>Search Towns</h2>
          <input
              type="text"
              placeholder="Search by Town"
              value={searchTown}
              onChange={(e) => setSearchTown(e.target.value)}
              style={{ width: "48%", marginRight: "4%", padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
          />
          <input
              type="text"
              placeholder="Search by Pincode"
              value={searchPincode}
              onChange={(e) => setSearchPincode(e.target.value)}
              style={{ width: "48%", padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
          />
          <button
              onClick={searchTowns}
              style={{
                marginTop: "0.75rem",
                width: "100%",
                padding: "0.7rem",
                backgroundColor: "#3182ce",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#2c5282")}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#3182ce")}
          >
            Search
          </button>
        </section>


        <ul
            style={{
              listStyle: "none",
              padding: 0,
              marginBottom: "2rem",
              borderTop: "1px solid #ddd",
              borderBottom: "1px solid #ddd",
            }}
        >
          {towns.length === 0 && (
              <li
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    color: "#666",
                    fontStyle: "italic",
                  }}
              >
                No towns found.
              </li>
          )}
          {towns.map((t) => (
              <li
                  key={t.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #eee",
                  }}
              >
            <span>
              <strong>{t.town}</strong> <small>({t.pincode})</small>
            </span>
                <button
                    onClick={() => deleteTown(t.id)}
                    style={{
                      backgroundColor: "#e53e3e",
                      border: "none",
                      borderRadius: 4,
                      padding: "0.3rem 0.7rem",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseOver={(e) =>
                        ((e.target as HTMLButtonElement).style.backgroundColor = "#c53030")
                    }
                    onMouseOut={(e) =>
                        ((e.target as HTMLButtonElement).style.backgroundColor = "#e53e3e")
                    }
                >
                  Delete
                </button>
              </li>
          ))}
        </ul>

        <section>
          <h2 style={{ marginBottom: "0.75rem" }}>Add Town</h2>

          <input
              type="text"
              placeholder="Town"
              value={town}
              onChange={(e) => setTown(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.75rem",
                borderRadius: 4,
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
          />

          <input
              type="text"
              placeholder="Pincode (XX-XXX)"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "1rem",
                borderRadius: 4,
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
          />

          <button
              onClick={addTown}
              disabled={!town.trim() || !pincode.trim()}
              style={{
                width: "100%",
                padding: "0.7rem",
                backgroundColor: "#3182ce",
                border: "none",
                borderRadius: 4,
                cursor: town.trim() && pincode.trim() ? "pointer" : "not-allowed",
                fontWeight: "bold",
                fontSize: "1rem",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) =>
                  town.trim() && pincode.trim()
                      ? ((e.target as HTMLButtonElement).style.backgroundColor = "#2c5282")
                      : null
              }
              onMouseOut={(e) =>
                  town.trim() && pincode.trim()
                      ? ((e.target as HTMLButtonElement).style.backgroundColor = "#3182ce")
                      : null
              }
          >
            Add Town
          </button>
        </section>
      </main>
  );
}
