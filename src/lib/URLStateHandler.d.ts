import { CustomValidationProps, StateValue, StaticBuildProps, URLSearchParamsProps } from './types';
export declare class URLStateHandler<TValue extends string> {
    private props;
    private constructor();
    static build<TValues extends string>(props: StaticBuildProps<TValues>): URLStateHandler<TValues>;
    static customValidation<T extends string>(props: CustomValidationProps<T>): URLStateHandler<T>;
    getState(searchParams: URLSearchParamsProps): StateValue<TValue> | StateValue<TValue>[];
    setState(url: URLSearchParamsProps, value?: StateValue<TValue> | StateValue<TValue>[]): string;
    private matchedValuesInArray;
    private customSet;
    private customGet;
}
