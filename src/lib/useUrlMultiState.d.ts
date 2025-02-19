import { MultiBuildProps as MultiBuild, StateValue } from './types';
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
export declare function useUrlMultiState<TKey extends string, TId extends string, TValue extends string>(properties: Props<TKey, TId, TValue>): Return<TId, TValue>;
export {};
