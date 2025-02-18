import { useSearchParams } from "react-router";
import { useUrlState } from "../../lib/useUrlState";

export function useUrlSizeState() {
  const [searchParams, updateSearchParams] = useSearchParams();

  const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

  const { state, setState } = useUrlState({
    props: {
      type: "simple",
      params: {
        name: "size",
        defaultValue: "xs",
        values: sizes,
      },
    },
    searchParams,
    updateSearchParams,
  });

  return {
    sizeState: Array.isArray(state.value)
      ? (state.value[0] as (typeof sizes)[number])
      : (state.value as (typeof sizes)[number]),
    setSizeState: setState,
    sizes,
  };
}
