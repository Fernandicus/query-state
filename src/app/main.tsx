import React from "react";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { BrowserRouter } from "react-router";
import { FormStateProvider } from "./FormStateProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <FormStateProvider>
        <App />
      </FormStateProvider>
    </BrowserRouter>
  </StrictMode>
);
