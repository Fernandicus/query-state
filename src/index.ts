type URLSearchParamsProps = ConstructorParameters<
  typeof URLSearchParams
>[number];
type UrlStateProps<T extends string> = {
  name: string;
  values: ReadonlyArray<T>;
  defaultValue: Readonly<T>;
};

class URLStateHandler<TValues extends string, TStates extends string = string> {
  private constructor(
    private props: UrlStateProps<TValues>,
    private mutliState?: ReadonlyArray<TStates>
  ) {}

  static build<TValues extends string>(props: UrlStateProps<TValues>) {
    return new URLStateHandler(props);
  }

  private static buildMultiState<TV extends string, TS extends string>(
    props: UrlStateProps<TV>,
    mutliState: ReadonlyArray<TS>
  ) {
    return new URLStateHandler(props, mutliState);
  }

  getState(searchParamsProps: URLSearchParamsProps) {
    const queryNames = this.getQueryNames();
    if (typeof queryNames === "string")
      return this.getStateByName(searchParamsProps, queryNames);

    const entries = queryNames.map((name) => {
      return [name, this.getStateByName(searchParamsProps, name)];
    });

    return Object.fromEntries(entries) as Record<TStates, TValues>;
  }

  setState(url: URLSearchParamsProps, value?: Readonly<TValues>) {
    const urlSearchParams = new URLSearchParams(url);

    if (!value) {
      urlSearchParams.set(this.props.name, this.props.defaultValue.toString());
      return urlSearchParams.toString();
    }

    urlSearchParams.set(this.props.name, `${value}`);
    return urlSearchParams.toString();
  }

  setMultiState<TS extends string>(s: TS[]): URLStateHandler<TValues, TS> {
    return URLStateHandler.buildMultiState<TValues, TS>(this.props, s);
  }

  getQueryNames() {
    if (!this.mutliState || !this.mutliState.length) {
      return this.props.name;
    }

    const states = this.mutliState.map((st) =>
      this.props.name.concat(`.${st}`)
    );
    return [this.props.name, ...states];
  }

  private getStateByName(
    searchParamsProps: URLSearchParamsProps,
    name: string
  ) {
    const urlSearchParams = new URLSearchParams(searchParamsProps);

    const queryFound = urlSearchParams.get(name);

    if (!queryFound) return this.props.defaultValue;

    const valueFound = this.props.values.find((v) => v === queryFound);

    if (!valueFound) return this.props.defaultValue;

    return valueFound;
  }
}

const myUrl = "https://www.custom-url.com/path?form=a&form.input=c";
const urlSearchParams = new URL(myUrl).search;

const formUrlStateHandler = URLStateHandler.build({
  name: "form",
  values: ["a", "b", "c"],
  defaultValue: "c",
});

const multiForm = formUrlStateHandler.setMultiState(["input", "check"]);

console.log(multiForm.getState(urlSearchParams));
