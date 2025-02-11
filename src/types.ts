import { URLSearchParamsWrapper } from "./URLSearchParamsWrapper";

export type URLSearchParamsProps = ConstructorParameters<typeof URLSearchParams>[number];
export type URLStateValues<TValue extends string> = {
  values: ReadonlyArray<TValue>;
  defaultValue: Readonly<TValue>;
};

export type URLStateHandlerProps<TValue extends string> = URLStateValues<TValue> & {
  name: string;
  get?(searchParams: URLSearchParamsWrapper): TValue;
  set?(searchParams: URLSearchParamsWrapper, value?: TValue): URLSearchParamsWrapper;
};

export type StaticBuildProps<TValue extends string> = Omit<URLStateHandlerProps<TValue>, "get" | "set">;

export type UseUrlStateProps<TValue extends string> =
  | { type: "simple"; params: Omit<URLStateHandlerProps<TValue>, "get" | "set"> }
  | { type: "custom"; params: CustomValidationProps<TValue> }
  | { type: "any"; params: { name: string } };

export type ComposedBuildProps<TKey extends string, TId extends string, TValue extends Readonly<string>> = {
  key: TKey;
  ids: {
    [Key in TId]:
      | { type: "simple"; params: URLStateValues<TValue> }
      | { type: "custom"; params: Omit<CustomValidationProps<TValue>, "name"> }
      | { type: "any" };
  };
};

export type CustomValidationProps<T extends string> = {
  name: string;
  getState?: (urlSearchParams: URLSearchParamsWrapper) => T;
  setState?(urlSearchParams: URLSearchParamsWrapper, value?: string): URLSearchParamsWrapper;
};
