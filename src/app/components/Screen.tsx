import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { useUrlSizeState } from "../hooks/useUrlSizeState";
import { useUrlColorState } from "../hooks/useUrlColorsState";

export function Screen() {
  const { sizes, sizeState } = useUrlSizeState();
  const { defaultColor, colorsState } = useUrlColorState();

  const size = useMemo(() => {
    const size: Record<(typeof sizes)[number], string> = { xl: "70%", lg: "60%", md: "50%", sm: "40%", xs: "30%" };
    return size[sizeState];
  }, [sizeState]);

  const color = useMemo(() => {
    const linearGradient = "linear-gradient(45deg,";
    if (colorsState.isArray(colorsState.value)) {
      const colors = colorsState.value.join(", ");
      return linearGradient.concat(`${colors})`);
    }

    return linearGradient.concat(`${colorsState.value}, ${colorsState.value})`);
  }, [colorsState.value]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px",
        }}
      >
        <div
          style={{
            width: size,
            height: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <label style={{ fontSize: "12px", color: "white" }}>size: {sizeState}</label>
          <div
            style={{
              background: color,
              border: "1px solid #ffffff26",
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {colorsState.is(defaultColor) && (
              <h1
                style={{
                  color: "#ffffff26",
                }}
              >
                No colors
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
