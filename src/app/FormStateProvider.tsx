import React from "react";
import { createContext, useContext } from "react";
import { useUrlMultiState } from "../lib";
import { useSearchParams } from "react-router";

type Shape = "box" | "rounded";
type FormState = {
  title: string;
  shape: Shape;
  setTitle(title: string): void;
  setShape(shape: Shape): void;
  clean(shape: "title" | "shape"): void;
  validate(): string;
  shapes: Shape[];
};

const FormStateCtx = createContext<FormState>({
  title: "",
  shape: "box",
  setTitle() {},
  setShape() {},
  clean() {},
  validate: () => "",
  shapes: [],
});

export const formContext = () => useContext(FormStateCtx);

export function FormStateProvider({ children }: { children: JSX.Element }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const shapes: Shape[] = ["box", "rounded"];

  const urlState = useUrlMultiState({
    props: {
      name: "input",
      ids: {
        title: {
          type: "any",
        },
        shape: {
          type: "simple",
          params: {
            defaultValue: "box",
            values: ["box", "rounded"] as Shape[],
          },
        },
      },
    },
    searchParams,
    updateSearchParams: setSearchParams,
  });

  return (
    <FormStateCtx.Provider
      value={{
        shapes,
        shape: urlState.state.firstElement("shape") as Shape,
        title: urlState.state.firstElement("title"),
        setShape(shape) {
          urlState.setState("shape", shape);
        },
        setTitle(title) {
          urlState.setState("title", title);
        },
        clean(t) {
          urlState.clean(t, "all");
        },
        validate() {
          return urlState.state.validateAll();
        },
      }}
    >
      {children}
    </FormStateCtx.Provider>
  );
}
