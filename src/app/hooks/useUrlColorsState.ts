import { useSearchParams } from "react-router";
import { useUrlState } from "../../lib/useUrlState";

export function useUrlColorState() {
  const [searchParams, updateSearchParams] = useSearchParams();
  const defaultColor = "#143140";
  const colors = ["orange", "lime", "teal", "cornflowerblue", "cornsilk", defaultColor] as const;

  const { state, setState } = useUrlState({
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
    colorsState: state.value,
    setColorsState: setState,
    colors,
    defaultColor,
  };
}
