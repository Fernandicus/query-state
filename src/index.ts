type URLSearchParamsProps = ConstructorParameters<typeof URLSearchParams>[number];

type Props<TValue extends string> = {
  name: string;
  values: ReadonlyArray<TValue>;
  defaultValue: Readonly<TValue>;
};

type Id<TValue extends string> = {
  values: ReadonlyArray<TValue>;
  defaultValue: Readonly<TValue>;
};

type BuildComposedProps<TKey extends string, TId extends string, TValue extends string> = {
  key: TKey;
  ids: Record<TId, Id<TValue>>;
};

export class URLStateHandler<TValue extends string> {
  private constructor(private props: Props<TValue>) {
    this.props = props;
  }

  static build<TValues extends string>(props: Props<TValues>) {
    return new URLStateHandler(props);
  }

  static buildComposed<TKey extends string, TId extends string, TValue extends string>({
    key,
    ids,
  }: BuildComposedProps<TKey, TId, TValue>): Record<TId, URLStateHandler<TValue>> {
    const all = {} as Record<TId, URLStateHandler<TValue>>;

    Object.entries<Id<TValue>>(ids).forEach(([name, id]) => {
      all[name] = new URLStateHandler({
        name: `${key}.${name}`,
        values: ids[name].values,
        defaultValue: ids[name].defaultValue,
      });
    });

    return all;
  }

  getState(searchParamsProps: URLSearchParamsProps) {
    const urlSearchParams = new URLSearchParams(searchParamsProps);

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
