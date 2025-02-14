import { URLStateHandler } from "./URLStateHandler";
import { StateValue, UseUrlStateProps } from "./types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { unhandledValue } from "./utils";

type Return<T extends string> = [StateValue<T> | StateValue<T>[], (v: StateValue<T> | StateValue<T>[]) => void];

export function useUrlState<T extends string>(props: UseUrlStateProps<T>, search?: URLSearchParams): Return<T> {
  const [searchParams, setSearchParams] = useState(search && search.toString());

  useEffect(() => {
    if (search) {
      setSearchParams(search.toString());
    } else {
      setSearchParams(location.search);
    }
  }, [search ?? location.search]);

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
  }, [props]);

  const setState = useCallback(
    (v: StateValue<T> | StateValue<T>) => {
      const newState = urlStateHandler.setState(location.search, v);
      window.history.pushState({}, "", "?" + newState);
      setSearchParams(newState);
    },
    [urlStateHandler]
  );

  const getState = urlStateHandler.getState(searchParams);

  return [getState, setState];
}
