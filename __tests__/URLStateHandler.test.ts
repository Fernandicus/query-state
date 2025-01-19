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

  it.only("Set State", async () => {
    const checkValidValues = ["x", "y", "z"];
    const checkUrlValues = ["x", "y", "o"];

    const myUrl = `https://www.custom-url.com/path?form.inpt=a&form.chks=${checkUrlValues.join(",")}`;
    const searchParams = new URL(myUrl).search;

    const formUrlStateHandler = URLStateHandler.buildComposed({
      key: "form",
      ids: {
        inpt: {
          defaultValue: "a",
          values: ["a", "b", "c"],
        },
        chks: {
          values: checkValidValues,
          defaultValue: "x",
        },
      },
    });

    const state = formUrlStateHandler.chks.getState(searchParams);

    const expectedResult = () => {
      const setOfValues = new Set(checkValidValues);
      const matchedValues = new Set(checkUrlValues).intersection(setOfValues);
      return Array.from(matchedValues);
    };

    expect(state).toEqual(expect.arrayContaining(expectedResult()));
  });
});
