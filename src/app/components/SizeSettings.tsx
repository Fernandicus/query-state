import React from "react";
import { useUrlSizeState } from "../hooks/useUrlSizeState";

export function SizeSettings() {
  const { setSizeState, sizes, sizeState, clean: cleanSize } = useUrlSizeState();

  return (
    <nav>
      <ul className="flex">
        {sizes.map((size, i) => {
          return (
            <li key={i}>
              <button
                className={`btn color-btn ${size === sizeState && "color-btn__selected"}`}
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
            className={`btn color-btn color-btn__remove`}
            onClick={() => {
              cleanSize("all");
            }}
          >
            Clean size
          </button>
        </li>
      </ul>
    </nav>
  );
}
