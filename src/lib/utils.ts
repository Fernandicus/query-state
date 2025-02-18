import { StateValue } from "./types";

export function unhandledValue(v: never): v is never {
  throw new Error("Unhandled type " + v);
}

type CleanProps = {
  deleteValue: string | string[] | "all";
  searchParams: URLSearchParams;
  name: string;
  currentState: string | string[];
};
export function cleanState(props: CleanProps) {
  const { currentState, deleteValue, name, searchParams } = props;

  if (deleteValue === "all") {
    searchParams.delete(name);
    return searchParams;
  }

  const currentValues = new Set([currentState].flat());
  const cleanedValues = currentValues.difference(new Set([deleteValue].flat()));

  if (cleanedValues.size === 0) {
    searchParams.delete(name);
    return searchParams;
  }

  searchParams.set(name, Array.from(cleanedValues).toString());

  return searchParams;
}
