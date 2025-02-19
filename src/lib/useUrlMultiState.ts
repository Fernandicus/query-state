import { useCallback, useEffect, useMemo, useState } from "react";
import { MultiBuildProps as MultiBuild, StateValue } from "./types";
import { URLMultiStateHandler } from "./URLMultiStateHandler";
import { cleanState } from "./utils";

type MultiBuildProps<TKey extends string, TId extends string, TValue extends string> = {
  name?: TKey;
  ids: MultiBuild<TKey, TId, TValue>["ids"];
};

type Return<TId extends string, TValue extends string> = {
  state: {
    value(id: TId): StateValue<TValue> | StateValue<TValue>[];
    is(id: TId, v: StateValue<TValue>): boolean;
    has(id: TId, v: StateValue<TValue>): boolean;
    isArray(v: StateValue<TValue> | StateValue<TValue>[]): v is StateValue<TValue>[];
    firstElement(id: TId): StateValue<TValue>;
    validateAll(): string;
  };
  setState(key: TId, value: StateValue<TValue> | StateValue<TValue>[]): void;
  clean(id: TId, v: StateValue<TValue> | StateValue<TValue>[] | "all"): void;
};

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
    if (!props.name) {
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

  const stateValue = useCallback((id: TId) => urlStateHandler.getState(searchParams, id), [searchParams]);

  return {
    state: {
      value(id: TId) {
        return urlStateHandler.getState(params, id);
      },
      is(id: TId, v: StateValue<TValue>) {
        return this.value(id) === v;
      },
      has(id: TId, v: StateValue<TValue>) {
        return stateValue(id).includes(v);
      },
      isArray: isArray,
      firstElement(id: TId) {
        const value = stateValue(id);
        if (isArray(value)) return value[0];
        return value;
      },
      validateAll() {
        return urlStateHandler.getAll(searchParams);
      },
    },
    clean(id, deleteValue) {
      const cleanedSearchParams = cleanState({
        currentState: stateValue(id),
        deleteValue,
        name: buildNameFromKey({
          name: props.name,
          id,
        }),
        searchParams,
      });

      updateSearchParams(cleanedSearchParams);
    },
    setState,
  };
}

function isArray<T extends string>(v: StateValue<T> | StateValue<T>[]): v is StateValue<T>[] {
  return Array.isArray(v);
}

function buildNameFromKey(props: { name: string; id: string }) {
  return props.name ? `${props.name}.${props.id}` : props.id;
}
