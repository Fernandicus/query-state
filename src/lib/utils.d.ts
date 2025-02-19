export declare function unhandledValue(v: never): v is never;
type CleanProps = {
    deleteValue: string | string[] | "all";
    searchParams: URLSearchParams;
    name: string;
    currentState: string | string[];
};
export declare function cleanState(props: CleanProps): URLSearchParams;
export {};
