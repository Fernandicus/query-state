import { URLStateHandler } from "./URLStateHandler";
import { UseUrlStateProps } from "./types";
import { useCallback, useEffect, useMemo, useState } from "react";

type Return<T extends string> = [T | T[], (v: T | (string & {})) => void];

export function useUrlState<T extends string>(props: UseUrlStateProps<T>): Return<T> {
  const [searchParams, setSearchParams] = useState(location.search);

  useEffect(() => {
    setSearchParams(location.search);
  }, [location.search]);

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
    (v: T) => {
      const newState = urlStateHandler.setState(location.search, v);
      window.history.pushState({}, "", "?" + newState);
      setSearchParams(newState);
    },
    [searchParams]
  );

  const getState = urlStateHandler.getState(searchParams);

  return [getState, setState];
}

function unhandledValue(v: never): v is never {
  throw new Error("Unhandled type " + v);
}
