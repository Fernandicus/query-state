export type URLSearchParamsProps = ConstructorParameters<typeof URLSearchParams>[number];
export type URLStateValues<TValue extends string> = {
  values: ReadonlyArray<TValue>;
  defaultValue: Readonly<TValue>;
};

export type URLStateHandlerProps<TValue extends string> = URLStateValues<TValue> & {
  name: string;
  get?(searchParams: URLSearchParams): TValue;
  set?(searchParams: URLSearchParams, value?: TValue): URLSearchParams;
};

export type StaticBuildProps<TValue extends string> = Omit<URLStateHandlerProps<TValue>, "get" | "set">;

export type ComposedBuildProps<TKey extends string, TId extends string, TValue extends Readonly<string>> = {
  key: TKey;
  ids: {
    [Key in TId]:
      | ({ type?: "simple" } & URLStateValues<TValue>)
      | ({ type: "custom" } & Omit<CustomValidationProps<TValue>, "name">);
  };
};

export type CustomValidationProps<T extends string> = {
  name: string;
  getState?: (urlSearchParams: URLSearchParams) => T;
  setState?(urlSearchParams: URLSearchParams, value?: string): URLSearchParams;
};
