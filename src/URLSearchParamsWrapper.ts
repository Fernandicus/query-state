type Props = {
  queryName: string;
  searchParams: ConstructorParameters<typeof URLSearchParams>[number];
};

export class URLSearchParamsWrapper {
  private queryName: string;
  private urlSearchParams: URLSearchParams;

  constructor(props: Props) {
    this.queryName = props.queryName;
    this.urlSearchParams = new URLSearchParams(props.searchParams);
  }

  set(value: string) {
    return this.urlSearchParams.set(this.queryName, value);
  }

  append(value: string) {
    return this.urlSearchParams.append(this.queryName, value);
  }

  get() {
    return this.urlSearchParams.get(this.queryName);
  }

  getAll() {
    return this.urlSearchParams.getAll(this.queryName);
  }

  delete() {
    return this.urlSearchParams.delete(this.queryName);
  }

  has() {
    return this.urlSearchParams.has(this.queryName);
  }

  entries() {
    return this.urlSearchParams.entries();
  }

  keys() {
    return this.urlSearchParams.keys();
  }

  sort() {
    return this.urlSearchParams.sort();
  }

  values() {
    return this.urlSearchParams.values();
  }

  toString() {
    return this.urlSearchParams.toString();
  }

  private matchedValuesInArray(values: string, splitedQueryFound: string[]) {
    const setOfValues = new Set(values);
    const matchedValues = new Set(splitedQueryFound).intersection(setOfValues);
    return Array.from(matchedValues);
  }
}
