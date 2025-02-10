import { URLStateHandler } from "./URLStateHandler";
import { UseUrlStateProps } from "./types";
import { useCallback, useEffect, useMemo, useState } from "react";

type Return<T extends string> = [T | T[], (v: T) => void];

export function useUrlState<T extends string>(props: UseUrlStateProps<T>): Return<T> {
  const [searchParams, setSearchParams] = useState(location.search);

  useEffect(() => {
    setSearchParams(location.search);
  }, [location.search]);

  const urlStateHandler = useMemo(() => {
    return props.type === "custom"
      ? URLStateHandler.customValidation(props.params)
      : URLStateHandler.build(props.params);
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
