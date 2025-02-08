import {
  ComposedBuildProps,
  CustomValidationProps,
  StaticBuildProps,
  URLSearchParamsProps,
  URLStateHandlerProps,
  URLStateValues,
} from "./types";

export class URLStateHandler<TValue extends string> {
  private constructor(private props: URLStateHandlerProps<TValue>) {
    this.props = props;
  }

  static build<TValues extends string>(props: StaticBuildProps<TValues>) {
    return new URLStateHandler(props);
  }

  static buildComposed<TValue extends string, TKey extends string = string, TId extends string = string>(
    props: ComposedBuildProps<TKey, TId, TValue>
  ): Record<TId, URLStateHandler<TValue>> {
    const { key, ids } = props;
    const all = {} as Record<TId, URLStateHandler<TValue>>;

    Object.keys(ids).forEach((k) => {
      const name = k as keyof typeof ids;
      const id = ids[name];

      if (id.type == "custom") {
        all[name] = URLStateHandler.customValidation({
          name: `${key}.${name}`,
          getState: id.getState,
          setState: id.setState,
        });
        return;
      }

      all[name] = new URLStateHandler<TValue>({
        name: `${key}.${name}`,
        values: id.values,
        defaultValue: id.defaultValue,
      });
    });

    return all;
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

  getState(searchParamsProps: URLSearchParamsProps): TValue | TValue[] {
    const urlSearchParams = new URLSearchParams(searchParamsProps);

    if (this.props.get) {
      return this.props.get(urlSearchParams);
    }

    const queryFound = urlSearchParams.get(this.props.name);

    if (!queryFound) return this.props.defaultValue;

    const splitedQueryFound = queryFound.split(",");

    if (splitedQueryFound.length > 1) {
      const setOfValues = new Set(this.props.values);
      const matchedValues = new Set(splitedQueryFound).intersection(setOfValues);
      return Array.from(matchedValues);
    }

    const valueFound = this.props.values.find((v) => v === queryFound);

    if (!valueFound) return this.props.defaultValue;

    return valueFound;
  }

  setState(url: URLSearchParamsProps, value?: Readonly<TValue>) {
    const urlSearchParams = new URLSearchParams(url);

    if (this.props.set) {
      return this.props.set(urlSearchParams, value).toString();
    }

    if (!value && !this.props.defaultValue) {
      urlSearchParams.delete(this.props.name);
      return urlSearchParams.toString();
    }

    if (!value) {
      urlSearchParams.set(this.props.name, this.props.defaultValue.toString());
      return urlSearchParams.toString();
    }

    if (!this.props.values.includes(value)) {
      urlSearchParams.set(this.props.name, this.props.defaultValue.toString());
      return urlSearchParams.toString();
    }

    urlSearchParams.set(this.props.name, `${value}`);
    return urlSearchParams.toString();
  }
}
