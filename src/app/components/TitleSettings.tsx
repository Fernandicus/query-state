import React from "react";
import { formContext } from "../FormStateProvider";

export function TitleSettings() {
  const ctx = formContext();

  return (
    <div className="flex">
      <input
        type="text"
        onChange={(v) => {
          ctx.setTitle(v.target.value);
        }}
        placeholder="Title"
        value={ctx.title}
        className="input"
        style={{
          width: "350px",
        }}
      />
      <button
        className="btn color-btn__remove"
        onClick={() => {
          ctx.clean("title");
        }}
      >
        Clean title
      </button>
    </div>
  );
}
