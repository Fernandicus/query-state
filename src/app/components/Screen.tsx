import React from "react";
import { useMemo } from "react";
import { useUrlSizeState } from "../hooks/useUrlSizeState";
import { useUrlColorState } from "../hooks/useUrlColorsState";
import { formContext } from "../FormStateProvider";
import "./Screen.css";

export function Screen() {
  const ctx = formContext();

  const { sizes, sizeState } = useUrlSizeState();
  const { defaultColor, colorsState } = useUrlColorState();

  const size = useMemo(() => {
    const size: Record<(typeof sizes)[number], string> = { xl: "100%", lg: "80%", md: "60%", sm: "40%", xs: "20%" };
    return size[sizeState];
  }, [sizeState, colorsState.value]);

  const color = useMemo(() => {
    const linearGradient = "linear-gradient(45deg,";

    if (colorsState.isArray(colorsState.value) && colorsState.value.length > 1) {
      const colors = colorsState.value.join(", ");
      return linearGradient.concat(`${colors})`);
    }

    if (colorsState.value.length) {
      return linearGradient.concat(`${colorsState.value}, ${colorsState.value})`);
    }

    return linearGradient.concat(`${defaultColor}, ${defaultColor})`);
  }, [colorsState.value]);

  return (
    <div
      className="screen-wrapper"
      style={{
        width: size,
      }}
    >
      <h2 className="screen-title"> {ctx.title.length ? ctx.title : "Title"}</h2>
      <div
        className="screen"
        style={{
          background: color,
          borderRadius: ctx.shape === "rounded" ? "100%" : "10px",
        }}
      >
        {colorsState.is(defaultColor) && <h1 className="screen__empty-title">No colors</h1>}
      </div>
    </div>
  );
}
