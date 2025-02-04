import { URLStateHandler } from ".";
import { StaticBuildProps } from "./types";
import { useCallback, useMemo, useState } from "react";

type Return<T extends string> = [T | T[], (v: T) => void];

export function useSimpleUrlState<T extends string>(props: StaticBuildProps<T>): Return<T> {
  const [searchParams, setSearchParams] = useState(location.search);

  const urlStateHandler = useMemo(() => {
    return URLStateHandler.build(props);
  }, [searchParams]);

  const setState = useCallback((v: T) => {
    const newState = urlStateHandler.setState(searchParams, v);
    window.history.pushState({}, "", newState);
    setSearchParams(newState);
  }, []);

  const getState = urlStateHandler.getState(searchParams);

  return [getState, setState];
}
