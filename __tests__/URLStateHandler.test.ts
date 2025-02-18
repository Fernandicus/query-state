import { URLStateHandler } from "../src/lib/URLStateHandler";

describe("On URLStateHandler", () => {
  it("Get State", async () => {
    const myUrl = "https://www.custom-url.com/path?form=a&form.input=c";
    const urlSearchParams = new URL(myUrl).search;

    const formUrlStateHandler = URLStateHandler.build({
      name: "form",
      values: ["a", "b", "c"],
      defaultValue: "c",
    });

    const state = formUrlStateHandler.getState(urlSearchParams);

    expect(state).toEqual("a");
  });

  it("Set State", async () => {
    const myUrl = "https://www.custom-url.com/path?form=a&form.input=c";
    const searchParams = new URL(myUrl).search;

    const formUrlStateHandler = URLStateHandler.build({
      name: "form",
      values: ["a", "b", "c"],
      defaultValue: "c",
    });

    const state = formUrlStateHandler.setState(searchParams, "b");

    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set("form", "b");

    expect(state).toEqual(urlSearchParams.toString());
  });

  it("Set invalid State will Set the default state", async () => {
    const myUrl = "https://www.custom-url.com/path?form=a&form.input=c";
    const searchParams = new URL(myUrl).search;

    const formUrlStateHandler = URLStateHandler.build<string>({
      name: "form",
      values: ["a", "b", "c"],
      defaultValue: "c",
    });

    const state = formUrlStateHandler.setState(searchParams, "z");

    expect(new URLSearchParams(state).get("form")).toEqual("c");
  });

  it("withCustomValidation constructor", async () => {
    const myUrl = `https://www.custom-url.com/path?year=2010`;
    const searchParams = new URL(myUrl).search;

    const formUrlStateHandler = URLStateHandler.customValidation({
      name: "year",
      getState(urlSearchParams) {
        const yearString = urlSearchParams.get();
        const currentYear = new Date().getFullYear();

        const year = parseInt(yearString);
        if (isNaN(year) || year > currentYear) return currentYear.toString();

        return year.toString();
      },
      setState(urlSearchParams, v) {
        const year = parseInt(v);

        if (!year || isNaN(year)) {
          urlSearchParams.set(new Date().getFullYear().toString());
          return urlSearchParams;
        }

        urlSearchParams.set(v);
        return urlSearchParams;
      },
    });

    const setState = formUrlStateHandler.setState(searchParams, "2010");
    const getState = formUrlStateHandler.getState(searchParams);

    expect(setState).toEqual("year=2010");
    expect(getState).toEqual("2010");
  });
});
