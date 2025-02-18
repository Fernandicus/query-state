import React, { useEffect, useState } from "react";
import "./Settings.css";
import { useUrlColorState } from "../hooks/useUrlColorsState";
import { useUrlSizeState } from "../hooks/useUrlSizeState";

export function Settings() {
  const { setSizeState, sizes, sizeState } = useUrlSizeState();
  const { colorsState, setColorsState, colors, defaultColor } = useUrlColorState();

  return (
    <>
      <nav style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
        <ul style={{ display: "flex", gap: "10px" }}>
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
        </ul>
      </nav>
      <nav style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
        <ul style={{ display: "flex", gap: "10px" }}>
          {colors.map((color, i) => {
            return (
              <li key={i}>
                <button
                  className={`color-btn ${
                    color === defaultColor
                      ? "color-btn__default"
                      : `color-btn__${color} color-btn__${color}--${colorsState.includes(color)}`
                  }`}
                  onMouseOver={() => {}}
                  style={{
                    border: "none",
                    borderRadius: "50px",
                    padding: "5px 15px",
                    /* backgroundColor:
                      color === defaultColor
                        ? "#e23232"
                        : colorsState.includes(color)
                        ? `color-btn__${color}`
                        : "#063045", */
                    color: colorsState.includes(color) ? "black" : "white",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (color === defaultColor) {
                      setColorsState("");
                      return;
                    }

                    if (colorsState.includes(color)) {
                      const set = new Set([...colorsState]);
                      set.delete(color);
                      setColorsState(Array.from(set));
                      return;
                    }

                    if (Array.isArray(colorsState)) {
                      if (colorsState.length < 2) {
                        const set = new Set([...colorsState, color]);
                        setColorsState(Array.from(set));
                        return;
                      }

                      const set = new Set([...colorsState.filter((color) => color !== defaultColor), color]);
                      setColorsState(Array.from(set));
                      return;
                    }

                    setColorsState([colorsState, color]);
                  }}
                >
                  {color === defaultColor ? "Remove" : color}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
