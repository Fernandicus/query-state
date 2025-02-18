import { useEffect, useMemo, useState } from "react";
import { URLStateHandler } from "./URLStateHandler";
import { MultiBuildProps, StateValue } from "./types";
import { URLMultiStateHandler } from "./URLMultiStateHandler";

type SetState<TId extends string, TValue extends string> = {
  set: (id: TId, value: StateValue<TValue> | StateValue<TValue>[]) => void;
};
type GetState<TId extends string, TValue extends string> = {
  get: (id: TId) => StateValue<TValue> | StateValue<TValue>[];
};
type Return<TId extends string, TValue extends string> = [GetState<TId, TValue>, SetState<TId, TValue>];
type Props<TKey extends string, TId extends string, TValue extends string> = {
  props: MultiBuildProps<TKey, TId, TValue>;
  searchParams: URLSearchParams;
  updateSearchParams(s: URLSearchParams): void;
};

export function useUrlMultiState<TKey extends string, TId extends string, TValue extends string>(
  properties: Props<TKey, TId, TValue>
): Return<TId, TValue> {
  const { props, searchParams, updateSearchParams } = properties;

  const [params, setSearchParams] = useState(searchParams);

  useEffect(() => {
    setSearchParams(searchParams);
  }, [searchParams]);

  const urlStateHandler = useMemo(() => {
    return URLMultiStateHandler.buildComposed(props);
  }, [props]);

  const setState = useMemo(() => {
    return {
      set(key: TId, value: TValue) {
        const newState = urlStateHandler.setState({
          searchParams: params,
          key,
          value,
        });
        const newSearchParams = new URLSearchParams(newState);
        updateSearchParams(newSearchParams);
        setSearchParams(newSearchParams);
      },
    };
  }, [urlStateHandler]);

  const getState = useMemo(() => {
    return {
      get(k: TId) {
        return urlStateHandler.getState(params, k);
      },
    };
  }, [params, urlStateHandler]);

  return [getState, setState];
}
