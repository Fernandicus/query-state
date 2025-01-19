type URLSearchParamsProps = ConstructorParameters<typeof URLSearchParams>[number];

type Props<TValue extends string> = {
  name: string;
  values: ReadonlyArray<TValue>;
  defaultValue: Readonly<TValue>;
};
type BuildComposedProps = {
  key: string;
  ids: Record<
    string,
    {
      values: string[];
      defaultValue: string;
    }
  >;
};

export class URLStateHandler<TValue extends string> {
  private constructor(private props: Props<TValue>) {
    this.props = props;
  }

  static build<TValues extends string>(props: Props<TValues>) {
    return new URLStateHandler(props);
  }

  getState(searchParamsProps: URLSearchParamsProps) {
    const urlSearchParams = new URLSearchParams(searchParamsProps);

    const queryFound = urlSearchParams.get(this.props.name);

    if (!queryFound) return this.props.defaultValue;

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

    urlSearchParams.set(this.props.name, `${value}`);
    return urlSearchParams.toString();
  }
}
