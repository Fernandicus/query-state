import { renderHook, act } from "@testing-library/react";
import { useUrlState } from "../src/lib/useUrlState";

describe("On useUrlState", () => {
  const updateSearchParams = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.only("setState calls pushState and updates the state", async () => {
    const searchParams = new URLSearchParams({ some: "value" });

    const { result } = renderHook(() => {
      return useUrlState({
        props: {
          type: "simple",
          params: {
            name: "state",
            defaultValue: "off",
            values: ["on", "off"],
          },
        },
        searchParams,
        updateSearchParams,
      });
    });

    const firstResult = result.current;
    expect(firstResult.state.value).toEqual("off");

    act(() => {
      firstResult.setState("on");
    });

    const secondResult = result.current;
    searchParams.set("state", "on");
    expect(updateSearchParams).toBeCalledTimes(1);
    expect(updateSearchParams).toBeCalledWith(searchParams);
    expect(secondResult.state.value).toEqual("on");
  });

  it("set empty state sets the default state", async () => {
    const searchParams = new URLSearchParams({ some: "value" });

    const { result } = renderHook(() => {
      return useUrlState({
        props: {
          type: "simple",
          params: {
            defaultValue: "off",
            name: "state",
            values: ["on", "off"],
          },
        },
        searchParams,
        updateSearchParams,
      });
    });

    const firstResult = result.current;
    expect(firstResult.state.value).toEqual("off");

    act(() => {
      firstResult.setState("");
    });

    const secondResult = result.current;
    searchParams.set("state", "off");
    expect(updateSearchParams).toBeCalledTimes(1);
    expect(updateSearchParams).toBeCalledWith(searchParams);
    expect(secondResult.state.value).toEqual("off");
  });

  it("type custom", async () => {
    const searchParams = new URLSearchParams({ some: "value" });

    const { result } = renderHook(() => {
      return useUrlState({
        props: {
          type: "custom",
          params: {
            name: "state",
            getState(urlSearchParams) {
              if (!urlSearchParams.get()) return "off";
            },
            setState(urlSearchParams, value) {
              if (value === "off") {
                urlSearchParams.set("");
                return urlSearchParams;
              }
            },
          },
        },
        searchParams,
        updateSearchParams,
      });
    });

    const firstResult = result.current;
    expect(firstResult.state.value).toEqual("off");

    act(() => {
      firstResult.setState("on");
    });

    const secondResult = result.current;
    searchParams.set("state", "on");
    expect(updateSearchParams).toBeCalledTimes(1);
    expect(updateSearchParams).toBeCalledWith(searchParams);
    expect(secondResult.state.value).toEqual("on");
  });

  it("set any value in type any", async () => {
    const searchParams = new URLSearchParams({ some: "value" });

    const { result } = renderHook(() => {
      return useUrlState({
        props: {
          type: "any",
          params: {
            name: "name",
          },
        },
        searchParams,
        updateSearchParams,
      });
    });

    const firstResult = result.current;
    expect(firstResult.state.value).toEqual("");

    const newName = "John Doe";
    act(() => {
      firstResult.setState(newName);
    });

    const secondResult = result.current;
    searchParams.set("name", newName);
    expect(updateSearchParams).toBeCalledTimes(1);
    expect(updateSearchParams).toBeCalledWith(searchParams);
    expect(secondResult.state.value).toEqual(newName);
  });

  it("set empty string in type any", async () => {
    const searchParams = new URLSearchParams({ some: "value" });

    const { result } = renderHook(() => {
      return useUrlState({
        props: {
          type: "any",
          params: {
            name: "name",
          },
        },
        searchParams,
        updateSearchParams,
      });
    });

    const firstResult = result.current;
    expect(firstResult.state.value).toEqual("");

    act(() => {
      firstResult.setState("");
    });

    const secondResult = result.current;
    expect(updateSearchParams).toBeCalledTimes(1);
    expect(updateSearchParams).toBeCalledWith(searchParams);
    expect(secondResult.state.value).toEqual("");
  });

  it("set any value in type simple", async () => {
    const searchParams = new URLSearchParams({ some: "value" });

    const { result } = renderHook(() => {
      return useUrlState({
        props: {
          type: "simple",
          params: {
            name: "state",
            defaultValue: "a",
            values: ["a", "b"],
          },
        },
        searchParams,
        updateSearchParams,
      });
    });

    const firstResult = result.current;
    expect(firstResult.state.value).toEqual("a");

    act(() => {
      firstResult.setState("x");
    });

    const secondResult = result.current;
    searchParams.set("state", "a");
    expect(updateSearchParams).toBeCalledTimes(1);
    expect(updateSearchParams).toBeCalledWith(searchParams);
    expect(secondResult.state.value).toEqual("a");
    expect(secondResult.state.is("a")).toEqual(true);
  });

  it("set array value in type simple", async () => {
    const searchParams = new URLSearchParams({ some: "value" });

    const { result } = renderHook(() => {
      return useUrlState({
        props: {
          type: "simple",
          params: {
            name: "state",
            defaultValue: "a",
            values: ["a", "b"],
          },
        },
        searchParams,
        updateSearchParams,
      });
    });

    const firstResult = result.current;

    act(() => {
      firstResult.setState(["a", "b", "w"]);
    });

    const secondResult = result.current;

    searchParams.set("state", ["a", "b"].toString());
    expect(updateSearchParams).toBeCalledTimes(1);
    expect(updateSearchParams).toBeCalledWith(searchParams);
    expect(secondResult.state.value.length).toEqual(2);
    expect(secondResult.state.value).toEqual(expect.arrayContaining(["a", "b"]));
  });

  it("set array value in type any", async () => {
    const searchParams = new URLSearchParams({ some: "value" });

    const { result } = renderHook(() => {
      return useUrlState({
        props: {
          type: "any",
          params: {
            name: "state",
          },
        },
        searchParams,
        updateSearchParams,
      });
    });

    const firstResult = result.current;

    const newState = ["a", "b", "w"];
    act(() => {
      firstResult.setState(newState);
    });

    const secondResult = result.current;
    searchParams.set("state", newState.toString());
    expect(updateSearchParams).toBeCalledTimes(1);
    expect(updateSearchParams).toBeCalledWith(searchParams);
    expect(secondResult.state.value.length).toEqual(3);
    expect(secondResult.state.value).toEqual(expect.arrayContaining(newState));
  });
});
