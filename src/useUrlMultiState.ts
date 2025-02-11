import { useEffect, useMemo, useState } from "react";
import { URLStateHandler } from "./URLStateHandler";
import { MultiBuildProps, StateValue } from "./types";

type SetState<TId extends string, TValue extends string> = {
  set: (id: TId, value: StateValue<TValue> | StateValue<TValue>[]) => void;
};
type GetState<TId extends string, TValue extends string> = {
  get: (id: TId) => StateValue<TValue> | StateValue<TValue>[];
};
type Return<TId extends string, TValue extends string> = [GetState<TId, TValue>, SetState<TId, TValue>];

export function useUrlMultiState<TKey extends string, TId extends string, TValue extends string>(
  props: MultiBuildProps<TKey, TId, TValue>
): Return<TId, TValue> {
  const [searchParams, setSearchParams] = useState(location.search);

  useEffect(() => {
    setSearchParams(location.search);
  }, [location.search]);

  const urlStateHandler = useMemo(() => {
    return URLStateHandler.buildMulti(props);
  }, []);

  const setState = useMemo(() => {
    return {
      set(k: TId, v: TValue) {
        const newState = urlStateHandler[k].setState(searchParams, v);
        window.history.pushState({}, "", "?" + newState);
        setSearchParams(newState);
      },
    };
  }, [searchParams]);

  const getState = useMemo(() => {
    return {
      get(k: TId) {
        return urlStateHandler[k].getState(searchParams);
      },
    };
  }, [searchParams]);

  return [getState, setState];
}
