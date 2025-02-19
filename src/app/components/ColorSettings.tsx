import React from "react";

import { useUrlColorState } from "../hooks/useUrlColorsState";

export function ColorSettings() {
  const { colorsState, setColorsState, colors, defaultColor, clean: cleanColor } = useUrlColorState();
  return (
    <nav>
      <ul className="flex">
        {colors.map((color, i) => {
          return (
            <li key={i}>
              <button
                className={`btn color-btn ${
                  color === defaultColor
                    ? "color-btn__remove"
                    : `color-btn__${color} color-btn__${color}--${colorsState.has(color)}`
                }`}
                onClick={() => {
                  if (color === defaultColor) {
                    cleanColor("all");
                    return;
                  }

                  if (colorsState.has(color)) {
                    cleanColor(color);
                    return;
                  }

                  const set = new Set([...[colorsState.value].filter((color) => color !== defaultColor), color].flat());
                  setColorsState(Array.from(set));
                }}
              >
                {color === defaultColor ? "Clean colors" : color}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
