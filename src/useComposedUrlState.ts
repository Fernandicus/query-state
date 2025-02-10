import { useMemo, useState } from "react";
import { URLStateHandler } from "./URLStateHandler";
import { ComposedBuildProps } from "./types";

type SetState<TId extends string, TValue extends string> = { set: (id: TId, value: TValue) => void };
type GetState<TId extends string, TValue extends string> = { get: (id: TId) => TValue | TValue[] };
type Return<TId extends string, TValue extends string> = [GetState<TId, TValue>, SetState<TId, TValue>];

export function useComposedUrlState<TKey extends string, TId extends string, TValue extends string>(
  props: ComposedBuildProps<TKey, TId, TValue>
): Return<TId, TValue> {
  const [searchParams, setSearchParams] = useState(location.search);

  const urlStateHandler = useMemo(() => {
    return URLStateHandler.buildComposed(props);
  }, [searchParams]);

  const setState = useMemo(() => {
    return {
      set(k: TId, v: TValue) {
        const newState = urlStateHandler[k].setState(searchParams, v);
        window.history.pushState({}, "", newState);
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
