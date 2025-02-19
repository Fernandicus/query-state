import { MultiBuildProps, StateValue, URLSearchParamsProps } from './types';
import { URLStateHandler } from './URLStateHandler';
type GetState<TValue extends string> = ReturnType<URLStateHandler<TValue>["getState"]>;
type SetState<TValue extends string> = ReturnType<URLStateHandler<TValue>["setState"]>;
type SetStateProps<TValue extends string, TKey extends string> = {
    searchParams: URLSearchParamsProps;
    key: TKey;
    value: StateValue<TValue> | StateValue<TValue>[];
};
export declare class URLMultiStateHandler<TKey extends string = string, TId extends string = string, TValue extends string = string> {
    private props;
    private constructor();
    static buildComposed<TKey extends string = string, TId extends string = string, TValue extends string = string>(props: MultiBuildProps<TKey, TId, TValue>): URLMultiStateHandler<TKey, TId, TValue>;
    static container<TKey extends string = string, TId extends string = string, TValue extends string = string>(ids: MultiBuildProps<TKey, TId, TValue>["ids"]): URLMultiStateHandler<string, TId, TValue>;
    getState(searchParams: URLSearchParamsProps, key: keyof typeof this.props.ids): GetState<TValue>;
    setState({ key, searchParams, value }: SetStateProps<TValue, keyof typeof this.props.ids>): SetState<TValue>;
    getAll(searchParams: URLSearchParamsProps): string;
    private build;
    private buildNameFromKey;
}
export {};
