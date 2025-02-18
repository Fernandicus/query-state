import { URLStateHandler } from "./URLStateHandler";
import { StateValue, UseUrlStateProps } from "./types";
import { useCallback, useMemo } from "react";
import { unhandledValue } from "./utils";

type Return<T extends string> = {
  state: {
    value: StateValue<T> | StateValue<T>[];
    is(v: StateValue<T>): boolean;
    has(v: StateValue<T>): boolean;
    has(v: StateValue<T>): boolean;
    isArray(v: StateValue<T> | StateValue<T>[]): v is StateValue<T>[];
    firstElement(): StateValue<T>;
  };
  setState(v: StateValue<T> | StateValue<T>[]): void;
  clean(v: StateValue<T> | StateValue<T>[] | "all"): void;
};
type Props<T extends string> = {
  props: UseUrlStateProps<T>;
  searchParams: URLSearchParams;
  updateSearchParams(s: URLSearchParams): void;
};

export function useUrlState<T extends string>({ props, searchParams, updateSearchParams }: Props<T>): Return<T> {
  const urlStateHandler = useMemo(() => {
    const type = props.type;
    switch (type) {
      case "custom":
        return URLStateHandler.customValidation(props.params);
      case "simple":
        return URLStateHandler.build(props.params);
      case "any":
        return URLStateHandler.customValidation<T>({
          name: props.params.name,
          getState(searchParams) {
            return searchParams.get() ?? ("" as any);
          },
          setState(urlSearchParams, value) {
            urlSearchParams.set(value);
            return urlSearchParams;
          },
        });
      default:
        throw unhandledValue(type);
    }
  }, []);

  const setState = useCallback(
    (v: StateValue<T> | StateValue<T>[]) => {
      const newState = urlStateHandler.setState(searchParams, v);
      const newSearchParams = new URLSearchParams(newState);
      updateSearchParams(newSearchParams);
    },
    [searchParams]
  );

  const stateValue = useMemo(() => urlStateHandler.getState(searchParams), [searchParams]);

  return {
    state: {
      value: stateValue,
      is(v: StateValue<T>) {
        return stateValue === v;
      },
      has(v: StateValue<T>) {
        return stateValue.includes(v);
      },
      isArray: isArray,
      firstElement(): StateValue<T> {
        if (isArray(stateValue)) return stateValue[0];
        return stateValue;
      },
    },
    setState,
    clean(deleteValue) {
      if (deleteValue === "all") {
        searchParams.delete(props.params.name);
        updateSearchParams(searchParams);
        return;
      }

      const currentValues = new Set([stateValue].flat());
      const cleanedValues = currentValues.difference(new Set([deleteValue].flat()));

      if (cleanedValues.size === 0) {
        searchParams.delete(props.params.name);
        updateSearchParams(searchParams);
        return;
      }

      searchParams.set(props.params.name, Array.from(cleanedValues).toString());

      updateSearchParams(searchParams);
      return;
    },
  } satisfies Return<T>;
}

function isArray<T extends string>(v: StateValue<T> | StateValue<T>[]): v is StateValue<T>[] {
  return Array.isArray(v);
}
