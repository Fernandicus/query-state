import { URLStateHandler } from "./URLStateHandler";
import { StateValue, UseUrlStateProps } from "./types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { unhandledValue } from "./utils";

type Return<T extends string> = {
  state: {
    value: StateValue<T> | StateValue<T>[];
    is(v: T): boolean;
  };
  setState(v: StateValue<T> | StateValue<T>[]): void;
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
            urlSearchParams.set(value);
            return urlSearchParams;
          },
        });
      default:
        throw unhandledValue(type);
    }
  }, []);

  const setState = useCallback(
    (v: StateValue<T> | StateValue<T>) => {
      const newState = urlStateHandler.setState(params, v);
      const newSearchParams = new URLSearchParams(newState);
      updateSearchParams(newSearchParams);
      setSearchParams(newSearchParams);
    },
    [params]
  );

  return {
    state: {
      value: urlStateHandler.getState(params),
      is(v: T) {
        return this.value === v;
      },
    },
    setState,
  };
}
