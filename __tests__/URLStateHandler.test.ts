import { URLStateHandler } from "../src";

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
});
