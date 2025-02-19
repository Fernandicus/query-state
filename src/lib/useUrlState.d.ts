import { StateValue, UseUrlStateProps } from './types';
type Return<T extends string> = {
    state: {
        value: StateValue<T> | StateValue<T>[];
        is(v: StateValue<T>): boolean;
        has(v: StateValue<T>): boolean;
        has(v: StateValue<T>): boolean;
        isArray(v: StateValue<T> | StateValue<T>[]): v is StateValue<T>[];
        firstElement(): StateValue<T>;
    };
    setState(v: StateValue<T> | StateValue<T>[]): void;
    clean(v: StateValue<T> | StateValue<T>[] | "all"): void;
};
type Props<T extends string> = {
    props: UseUrlStateProps<T>;
    searchParams: URLSearchParams;
    updateSearchParams(s: URLSearchParams): void;
};
export declare function useUrlState<T extends string>({ props, searchParams, updateSearchParams }: Props<T>): Return<T>;
export {};
