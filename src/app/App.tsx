import React from "react";
import { Screen } from "./components/Screen";
import { Settings } from "./components/Settings";
import "./App.css";
import "./components/Settings.css";

import { QueryParamsScreen } from "./components/QueryParamsScreen";

export function App() {
  return (
    <div
      style={{
        padding: "20px 0",
      }}
      className="flex-space-around"
    >
      <div className="flex-col">
        <Settings />
        <div className="w-full flex-center">
          <Screen />
        </div>
      </div>
      <QueryParamsScreen />
    </div>
  );
}
