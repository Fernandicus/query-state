import React from "react";
import { formContext } from "../FormStateProvider";

export function ShapeSettings() {
  const ctx = formContext();

  return (
    <nav className="flex">
      {ctx.shapes.map((shape, i) => {
        return (
          <li key={i}>
            <button
              className={`btn color-btn ${ctx.shape === shape && "color-btn__selected"}`}
              onClick={() => {
                ctx.setShape(shape);
              }}
            >
              {shape}
            </button>
          </li>
        );
      })}
      <li>
        <button
          className={`btn color-btn color-btn__remove`}
          onClick={() => {
            ctx.clean("shape");
          }}
        >
          Clean shape
        </button>
      </li>
    </nav>
  );
}
