import { URLStateHandler } from "./URLStateHandler";
import { StateValue, UseUrlStateProps } from "./types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cleanState, unhandledValue } from "./utils";

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
  const [params, setSearchParams] = useState(searchParams);

  useEffect(() => {
    setSearchParams(searchParams);
  }, [searchParams]);

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
            if (!value) {
              urlSearchParams.delete();
              return urlSearchParams;
            }
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
      const newState = urlStateHandler.setState(params, v);
      const newSearchParams = new URLSearchParams(newState);
      setSearchParams(newSearchParams);
      updateSearchParams(newSearchParams);
    },
    [params]
  );

  const stateValue = useMemo(() => urlStateHandler.getState(params), [params]);

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
      const cleanedSearchParams = cleanState({
        currentState: stateValue,
        deleteValue,
        name: props.params.name,
        searchParams,
      });

      updateSearchParams(cleanedSearchParams);
      return;
    },
  } satisfies Return<T>;
}

function isArray<T extends string>(v: StateValue<T> | StateValue<T>[]): v is StateValue<T>[] {
  return Array.isArray(v);
}
