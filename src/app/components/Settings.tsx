import React from "react";
import "./Settings.css";
import { useUrlColorState } from "../hooks/useUrlColorsState";
import { useUrlSizeState } from "../hooks/useUrlSizeState";

export function Settings() {
  const { setSizeState, sizes, sizeState, clean: cleanSize } = useUrlSizeState();
  const { colorsState, setColorsState, colors, defaultColor, clean: cleanColor } = useUrlColorState();

  return (
    <div style={{ padding: "0px 15px" }}>
      <h2>Valid settings</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <nav>
          <ul style={{ display: "flex", gap: "10px", margin: "0", padding: "0" }}>
            {sizes.map((size, i) => {
              return (
                <li key={i}>
                  <button
                    style={{
                      border: "none",
                      borderRadius: "50px",
                      padding: "5px 15px",
                      backgroundColor: size === sizeState ? "#00caff8a" : "#063045",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSizeState(size);
                    }}
                  >
                    {size}
                  </button>
                </li>
              );
            })}
            <li>
              <button
                className={`color-btn color-btn__default`}
                style={{
                  border: "none",
                  borderRadius: "50px",
                  padding: "5px 15px",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => {
                  cleanSize("all");
                }}
              >
                Clean size
              </button>
            </li>
          </ul>
        </nav>
        <nav>
          <ul style={{ display: "flex", gap: "10px", margin: "0", padding: "0" }}>
            {colors.map((color, i) => {
              return (
                <li key={i}>
                  <button
                    className={`color-btn ${
                      color === defaultColor
                        ? "color-btn__default"
                        : `color-btn__${color} color-btn__${color}--${colorsState.has(color)}`
                    }`}
                    style={{
                      border: "none",
                      borderRadius: "50px",
                      padding: "5px 15px",
                      color: color !== defaultColor ? (colorsState.has(color) ? "black" : "white") : "",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (color === defaultColor) {
                        cleanColor("all");
                        return;
                      }

                      if (colorsState.has(color)) {
                        cleanColor(color);
                        return;
                      }

                      const set = new Set(
                        [...[colorsState.value].filter((color) => color !== defaultColor), color].flat()
                      );
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
      </div>
    </div>
  );
}
