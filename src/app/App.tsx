import React, { useState } from "react";
import { Screen } from "./components/Screen";
import { Settings } from "./components/Settings";
import "./App.css";

export function App() {
  const [page, setPage] = useState(true);
  return (
    <div>
      <nav>
        <ul>
          <button
            onClick={() => {
              setPage((prev) => !prev);
            }}
          >
            asd
          </button>
        </ul>
      </nav>
      {page && (
        <>
          <Settings />
          <Screen />
        </>
      )}
    </div>
  );
}
