import React from "react";
import "./Settings.css";
import { ColorSettings } from "./ColorSettings";
import { SizeSettings } from "./SizeSettings";
import { ShapeSettings } from "./ShapeSettings";
import { TitleSettings } from "./TitleSettings";

export function Settings() {
  return (
    <div className="flex-col">
      <TitleSettings />
      <ShapeSettings />
      <SizeSettings />
      <ColorSettings />
    </div>
  );
}
