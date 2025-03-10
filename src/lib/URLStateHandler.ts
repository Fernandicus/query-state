import {
  CustomValidationProps,
  StateValue,
  StaticBuildProps,
  URLSearchParamsProps,
  URLStateHandlerProps,
} from "./types";
import { URLSearchParamsWrapper } from "./URLSearchParamsWrapper";

export class URLStateHandler<TValue extends string> {
  private constructor(private props: URLStateHandlerProps<TValue>) {}

  static build<TValues extends string>(props: StaticBuildProps<TValues>) {
    return new URLStateHandler(props);
  }

  static customValidation<T extends string>(props: CustomValidationProps<T>) {
    return new URLStateHandler<T>({
      name: props.name,
      values: [] as T[],
      defaultValue: "" as T,
      get: props.getState,
      set: props.setState,
    });
  }

  getState(searchParams: URLSearchParamsProps): StateValue<TValue> | StateValue<TValue>[] {
    const urlSearchParams = new URLSearchParamsWrapper({ queryName: this.props.name, searchParams });

    if (this.props.get) {
      return this.customGet(urlSearchParams);
    }

    const queryFound = urlSearchParams.get();

    if (!queryFound) return this.props.defaultValue;

    const splitedQueryFound = queryFound.split(",");

    if (splitedQueryFound.length > 1) {
      return this.matchedValuesInArray(this.props.values, splitedQueryFound);
    }

    const valueFound = this.props.values.find((v) => v === queryFound);

    if (!valueFound) return this.props.defaultValue;

    return valueFound;
  }

  setState(url: URLSearchParamsProps, value?: StateValue<TValue> | StateValue<TValue>[]): string {
    const urlSearchParams = new URLSearchParamsWrapper({ queryName: this.props.name, searchParams: url });

    if (Array.isArray(value)) {
      if (this.props.set) {
        return this.customSet(urlSearchParams, value);
      }

      const matchedValues = this.matchedValuesInArray(this.props.values, value);
      if (matchedValues.length > 0) {
        urlSearchParams.set(matchedValues.join(","));
        return urlSearchParams.toString();
      }
      return urlSearchParams.toString();
    }

    if (this.props.set) {
      return this.customSet(urlSearchParams, value);
    }

    if (!value && !this.props.defaultValue) {
      urlSearchParams.delete();
      return urlSearchParams.toString();
    }

    if (!value) {
      urlSearchParams.set(this.props.defaultValue.toString());
      return urlSearchParams.toString();
    }

    if (!this.props.values.includes(value as TValue)) {
      urlSearchParams.set(this.props.defaultValue.toString());
      return urlSearchParams.toString();
    }

    urlSearchParams.set(`${value}`);
    return urlSearchParams.toString();
  }

  private matchedValuesInArray(values: ReadonlyArray<TValue>, splitedQueryFound: string[]) {
    const setOfValues = new Set(values);
    const matchedValues = new Set(splitedQueryFound).intersection(setOfValues);
    return Array.from(matchedValues);
  }

  private customSet(urlSearchParams: URLSearchParamsWrapper, value: StateValue<TValue> | StateValue<TValue>[]) {
    const state = this.props.set(urlSearchParams, value);

    if (state === undefined) {
      urlSearchParams.set(value ? `${value}` : "");
      return urlSearchParams.toString();
    }

    return state.toString();
  }

  private customGet(urlSearchParams: URLSearchParamsWrapper) {
    const state = this.props.get(urlSearchParams);

    if (state === undefined) {
      return urlSearchParams.get() ?? "";
    }

    const splited = state.split(",");
    if (splited.length > 1) return splited;

    return state;
  }
}
