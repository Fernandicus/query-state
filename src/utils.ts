export function unhandledValue(v: never): v is never {
  throw new Error("Unhandled type " + v);
}
