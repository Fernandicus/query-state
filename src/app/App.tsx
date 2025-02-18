import React, { useCallback, useMemo, useState } from "react";
import { Screen } from "./components/Screen";
import { Settings } from "./components/Settings";
import "./App.css";
import { formContext } from "./FormStateProvider";

export function App() {
  const ctx = formContext();

  return (
    <div>
      <input
        type="text"
        onChange={(v) => {
          ctx.setTitle(v.target.value);
        }}
        placeholder="Title"
        value={ctx.title}
        style={{
          backgroundColor: "white",
        }}
      />
      <button
        onClick={() => {
          ctx.clean("title");
        }}
      >
        Clean
      </button>
      <div style={{ padding: "15px" }}>
        <Settings />
        <Screen />
      </div>
    </div>
  );
}
