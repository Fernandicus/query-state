import { useSearchParams } from "react-router";
import { useUrlState } from "../../lib/useUrlState";

export function useUrlSizeState() {
  const [searchParams, updateSearchParams] = useSearchParams();

  const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

  const { state, setState, clean } = useUrlState({
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
    sizeState: state.firstElement(),
    setSizeState: setState,
    sizes,
    clean,
  };
}
