import { useSearchParams } from "react-router";
import { useUrlState } from "../../lib/useUrlState";
import { useEffect } from "react";

export function useUrlColorState() {
  const [searchParams, updateSearchParams] = useSearchParams();
  const defaultColor = "#143140";
  const colors = ["orange", "lime", "teal", "cornflowerblue", "cornsilk", defaultColor] as const;

  const { state, setState, clean } = useUrlState({
    searchParams,
    updateSearchParams,
    props: {
      type: "simple",
      params: {
        name: "colors",
        defaultValue: defaultColor,
        values: colors,
      },
    },
  });

  return {
    colorsState: state,
    setColorsState: setState,
    colors,
    defaultColor,
    clean,
  };
}
