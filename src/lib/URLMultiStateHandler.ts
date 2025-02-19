import { MultiBuildProps, StateValue, URLSearchParamsProps } from "./types";
import { URLStateHandler } from "./URLStateHandler";
import { unhandledValue } from "./utils";

type GetState<TValue extends string> = ReturnType<URLStateHandler<TValue>["getState"]>;
type SetState<TValue extends string> = ReturnType<URLStateHandler<TValue>["setState"]>;
type SetStateProps<TValue extends string, TKey extends string> = {
  searchParams: URLSearchParamsProps;
  key: TKey;
  value: StateValue<TValue> | StateValue<TValue>[];
};

export class URLMultiStateHandler<
  TKey extends string = string,
  TId extends string = string,
  TValue extends string = string
> {
  private constructor(private props: MultiBuildProps<TKey, TId, TValue>) {}

  static buildComposed<TKey extends string = string, TId extends string = string, TValue extends string = string>(
    props: MultiBuildProps<TKey, TId, TValue>
  ) {
    return new URLMultiStateHandler(props);
  }

  static container<TKey extends string = string, TId extends string = string, TValue extends string = string>(
    ids: MultiBuildProps<TKey, TId, TValue>["ids"]
  ) {
    return new URLMultiStateHandler<string, TId, TValue>({
      name: "",
      ids,
    });
  }

  getState(searchParams: URLSearchParamsProps, key: keyof typeof this.props.ids): GetState<TValue> {
    return this.build(key).getState(searchParams);
  }

  setState({ key, searchParams, value }: SetStateProps<TValue, keyof typeof this.props.ids>): SetState<TValue> {
    return this.build(key).setState(searchParams, value);
  }

  getAll(searchParams: URLSearchParamsProps) {
    const url = new URLSearchParams();

    Object.entries(this.props.ids).forEach(([k, v]) => {
      const key = k as keyof typeof this.props.ids;
      const state = this.build(key).getState(searchParams);
      if (!state) return;
      url.set(this.buildNameFromKey(key), state.toString());
    });

    return url.toString();
  }

  private build(key: keyof typeof this.props.ids) {
    const value = this.props.ids[key];
    const type = value.type;

    let handler: URLStateHandler<TValue>;

    switch (type) {
      case "custom":
        handler = URLStateHandler.customValidation({
          name: this.buildNameFromKey(key),
          getState: value.params.getState,
          setState: value.params.setState,
        });
        break;
      case "simple":
        handler = URLStateHandler.build<TValue>({
          name: this.buildNameFromKey(key),
          values: value.params.values,
          defaultValue: value.params.defaultValue,
        });
        break;
      case "any":
        handler = URLStateHandler.customValidation({
          name: this.buildNameFromKey(key),
          getState(searchParams) {
            return searchParams.get() ?? ("" as any);
          },
          setState(urlSearchParams, value) {
            if (!value) {
              urlSearchParams.delete();
              return urlSearchParams;
            }
            urlSearchParams.set(value);
            return urlSearchParams;
          },
        });
        break;
      default:
        throw unhandledValue(type);
    }

    return handler;
  }

  private buildNameFromKey(key: string) {
    const name = this.props.name;
    return name ? `${name}.${key}` : key;
  }
}
