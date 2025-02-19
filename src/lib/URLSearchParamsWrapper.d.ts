type Props = {
    queryName: string;
    searchParams: ConstructorParameters<typeof URLSearchParams>[number];
};
export declare class URLSearchParamsWrapper {
    private queryName;
    private urlSearchParams;
    constructor(props: Props);
    set(value: string): void;
    append(value: string): void;
    get(): string;
    getAll(): string[];
    delete(): void;
    has(): boolean;
    entries(): URLSearchParamsIterator<[string, string]>;
    keys(): URLSearchParamsIterator<string>;
    sort(): void;
    values(): URLSearchParamsIterator<string>;
    toString(): string;
}
export {};
