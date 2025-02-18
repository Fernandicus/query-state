import { URLMultiStateHandler } from "../src/lib/URLMultiStateHandler";

describe("On URLMultiStateHandler", () => {
  it("buildComposed constructor", async () => {
    const checkValidValues = ["x", "y", "z"] as const;
    const checkUrlValues = ["x", "y", "o"];

    const myUrl = `https://www.custom-url.com/path?form.inpt=a&form.chks=${encodeURIComponent(
      checkUrlValues.join(",")
    )}`;
    const searchParams = new URL(myUrl).search;

    const formUrlStateHandler = URLMultiStateHandler.buildComposed({
      name: "form",
      ids: {
        inpt: {
          type: "simple",
          params: {
            values: ["a", "b", "c"],
            defaultValue: "a",
          },
        },
        chks: {
          type: "simple",
          params: {
            values: ["x", "y", "z"],
            defaultValue: "x",
          },
        },
      },
    });

    const state = formUrlStateHandler.getState(searchParams, "chks");

    const expectedResult = () => {
      const setOfValues = new Set(checkValidValues);
      const matchedValues = new Set(checkUrlValues).intersection(setOfValues);
      return Array.from(matchedValues);
    };

    expect(state).toEqual(expect.arrayContaining(expectedResult()));

    const updatedChkState = formUrlStateHandler.setState({
      searchParams,
      key: "chks",
      value: ["x", "y", "_"],
    });
    expect(decodeURIComponent(updatedChkState)).toEqual("form.inpt=a&form.chks=x,y");

    const updatedInptState = formUrlStateHandler.setState({
      searchParams: updatedChkState,
      key: "inpt",
      value: ["b", "c"],
    });
    expect(decodeURIComponent(updatedInptState)).toEqual("form.inpt=b,c&form.chks=x,y");
  });

  it("buildComposed constructor with custom validation", async () => {
    const checkUrlValues = ["x", "y", "o"];

    const myUrl = `https://www.custom-url.com/path?form.inpt=a&form.chks=${checkUrlValues.join(",")}`;
    const searchParams = new URL(myUrl).search;

    const formUrlStateHandler = URLMultiStateHandler.buildComposed({
      name: "form",
      ids: {
        inpt: {
          type: "custom",
          params: {
            getState() {
              if (Math.random() > 1) return "b";
              return "a";
            },
            setState(searchParams) {
              return searchParams;
            },
          },
        },
      },
    });

    const state = formUrlStateHandler.getState(searchParams, "inpt");
    expect(state).toEqual("a");
  });

  it("buildComposed constructor with of type any", async () => {
    const myUrl = `https://www.custom-url.com/path?form.inpt=John%20Doe`;
    const searchParams = new URL(myUrl).search;

    const formHandler = URLMultiStateHandler.buildComposed({
      name: "form",
      ids: {
        inpt: {
          type: "any",
        },
      },
    });

    const state = formHandler.getState(searchParams, "inpt");
    expect(state).toEqual("John Doe");
  });

  it("buildComposed constructor, getState", async () => {
    const myUrl = `https://www.custom-url.com/path?form.inpt=a}`;
    const searchParams = new URL(myUrl).search;

    const formUrlStateHandler = URLMultiStateHandler.buildComposed({
      name: "form",
      ids: {
        inpt: {
          type: "simple",
          params: {
            defaultValue: "a",
            values: ["a", "b", "c"],
          },
        },
        chks: {
          type: "simple",
          params: {
            values: ["x", "y", "z"],
            defaultValue: "x",
          },
        },
      },
    });

    const state = formUrlStateHandler.getState(searchParams, "chks");

    expect(state).toEqual("x");
  });

  it("buildComposed constructor, setState", async () => {
    const checkValidValues = ["x", "y", "z"];
    const checkUrlValues = ["x", "y", "o"];

    const myUrl = `https://www.custom-url.com/path?form.inpt=a&form.chks=${checkUrlValues.join(",")}`;
    const searchParams = new URL(myUrl).search;

    const formUrlStateHandler = URLMultiStateHandler.buildComposed({
      name: "form",
      ids: {
        inpt: {
          type: "simple",
          params: {
            defaultValue: "a",
            values: ["a", "b", "c"],
          },
        },
        chks: {
          type: "simple",
          params: {
            values: checkValidValues,
            defaultValue: "x",
          },
        },
      },
    });

    const state = formUrlStateHandler.setState({
      searchParams,
      key: "chks",
      value: "m",
    });

    expect(new URLSearchParams(state).get("form.chks")).toEqual("x");
  });

  it("container", () => {
    const searchParams = new URLSearchParams();
    const handler = URLMultiStateHandler.container({
      from: {
        type: "custom",
        params: {
          getState(urlSearchParams) {
            const state = urlSearchParams.get();
            if (state === "a") return "x";
            if (state === "b") return "z";
          },
          setState(url, value) {
            if (value === "x") url.set(value);
            if (value === "z") url.set("b");

            return url;
          },
        },
      },
      color: {
        type: "simple",
        params: {
          defaultValue: "red",
          values: ["red", "blue", "white"],
        },
      },
    });

    const colorState = handler.getState(searchParams, "color");
    const fromState = handler.getState(searchParams, "from");

    expect(colorState).toEqual("red");
    expect(fromState).toEqual("");

    const colorNewState = handler.setState({
      searchParams,
      key: "color",
      value: "blue",
    });
    const fromNewState = handler.setState({
      searchParams,
      key: "from",
      value: "z",
    });

    expect(colorNewState).toEqual("color=blue");
    expect(fromNewState).toEqual("from=b");

    const newSearchParame = new URLSearchParams({ color: "w" });
    expect(handler.getAll(newSearchParame)).toEqual("color=red");
  });
});
