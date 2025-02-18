import { useCallback, useEffect, useMemo, useState } from "react";
import { MultiBuildProps as MultiBuild } from "./types";
import { URLMultiStateHandler } from "./URLMultiStateHandler";

type MultiBuildProps<TKey extends string, TId extends string, TValue extends string> = {
  name?: TKey;
  ids: MultiBuild<TKey, TId, TValue>["ids"];
};

type Props<TKey extends string, TId extends string, TValue extends string> = {
  props: MultiBuildProps<TKey, TId, TValue>;
  searchParams: URLSearchParams;
  updateSearchParams(s: URLSearchParams): void;
};

export function useUrlMultiState<TKey extends string, TId extends string, TValue extends string>(
  properties: Props<TKey, TId, TValue>
) {
  const { props, searchParams, updateSearchParams } = properties;

  const [params, setSearchParams] = useState(searchParams);

  useEffect(() => {
    setSearchParams(searchParams);
  }, [searchParams]);

  const urlStateHandler = useMemo(() => {
    if (props.name!) {
      return URLMultiStateHandler.container(props.ids);
    }

    return URLMultiStateHandler.buildComposed({
      ids: props.ids,
      name: props.name,
    });
  }, [props]);

  const setState = useCallback(
    (key: TId, value: TValue) => {
      const newState = urlStateHandler.setState({
        searchParams: params,
        key,
        value,
      });
      const newSearchParams = new URLSearchParams(newState);
      updateSearchParams(newSearchParams);
      setSearchParams(newSearchParams);
    },
    [urlStateHandler]
  );

  return {
    state: {
      value(id: TId) {
        return urlStateHandler.getState(params, id);
      },
      is(id: TId, v: TValue) {
        return this.value(id) === v;
      },
    },
    setState,
  };
}
