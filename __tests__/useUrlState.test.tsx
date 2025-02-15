import { renderHook, act } from "@testing-library/react";
import { useUrlState } from "../src/lib/useUrlState";

const mockedPushState = vi.fn();

vi.spyOn(window, "location", "get").mockReturnValue({
  ...window.location,
  search: "?some=query",
});

vi.spyOn(window, "history", "get").mockReturnValue({
  ...window.history,
  pushState: mockedPushState,
});

describe("On useUrlState", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("setState calls pushState and updates the state", async () => {
    const { result } = renderHook(() => {
      return useUrlState({
        type: "simple",
        params: {
          defaultValue: "off",
          name: "state",
          values: ["on", "off"],
        },
      });
    });

    const [firstState, setState] = result.current;
    expect(firstState).toEqual("off");

    act(() => {
      setState("on");
    });

    const [secondState] = result.current;
    expect(mockedPushState).toBeCalledTimes(1);
    expect(secondState).toEqual("on");
  });

  it("set empty state sets the default state", async () => {
    const { result } = renderHook(() => {
      return useUrlState({
        type: "simple",
        params: {
          defaultValue: "off",
          name: "state",
          values: ["on", "off"],
        },
      });
    });

    const [firstState, setState] = result.current;
    expect(firstState).toEqual("off");

    act(() => {
      setState("");
    });

    const [secondState] = result.current;
    expect(mockedPushState).toBeCalledTimes(1);
    expect(secondState).toEqual("off");
  });

  it("type custom", async () => {
    const { result } = renderHook(() => {
      return useUrlState({
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
      });
    });

    const [firstState, setState] = result.current;
    expect(firstState).toEqual("off");

    act(() => {
      setState("on");
    });

    const [secondState] = result.current;
    expect(mockedPushState).toBeCalledTimes(1);
    expect(secondState).toEqual("on");
  });

  it("set any value in type any", async () => {
    const { result } = renderHook(() => {
      return useUrlState({
        type: "any",
        params: {
          name: "name",
        },
      });
    });

    const [firstState, setState] = result.current;
    expect(firstState).toEqual("");

    act(() => {
      setState("John Doe");
    });

    const [secondState] = result.current;
    expect(mockedPushState).toBeCalledTimes(1);
    expect(secondState).toEqual("John Doe");
  });

  it("set any value in type simple", async () => {
    const { result } = renderHook(() => {
      return useUrlState({
        type: "simple",
        params: {
          name: "state",
          defaultValue: "a",
          values: ["a", "b"],
        },
      });
    });

    const [firstState, setState] = result.current;
    expect(firstState).toEqual("a");

    act(() => {
      setState("x");
    });

    const [secondState] = result.current;
    expect(mockedPushState).toBeCalledTimes(1);
    expect(secondState).toEqual("a");
  });

  it("set array value in type simple", async () => {
    const { result } = renderHook(() => {
      return useUrlState({
        type: "simple",
        params: {
          name: "state",
          defaultValue: "a",
          values: ["a", "b"],
        },
      });
    });

    const [_, setState] = result.current;

    act(() => {
      setState(["a", "b", "w"]);
    });

    const [secondState] = result.current;
    expect(mockedPushState).toBeCalledTimes(1);
    expect(secondState.length).toEqual(2);
    expect(secondState).toEqual(expect.arrayContaining(["a", "b"]));
  });

  it("set array value in type any", async () => {
    const { result } = renderHook(() => {
      return useUrlState({
        type: "any",
        params: {
          name: "state",
        },
      });
    });

    const [_, setState] = result.current;

    act(() => {
      setState(["a", "b", "w"]);
    });

    const [secondState] = result.current;
    expect(mockedPushState).toBeCalledTimes(1);
    expect(secondState.length).toEqual(3);
    expect(secondState).toEqual(expect.arrayContaining(["a", "b", "w"]));
  });
});
