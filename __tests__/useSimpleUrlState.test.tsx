import { renderHook, act } from "@testing-library/react";
import { useSimpleUrlState } from "../src/useSimpleUrlState";

const mockedPushState = vi.fn();

vi.spyOn(window, "location", "get").mockReturnValue({
  ...window.location,
  search: "?some=query",
});

vi.spyOn(window, "history", "get").mockReturnValue({
  ...window.history,
  pushState: mockedPushState,
});

describe("On useSimpleUrlState", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("setState calls pushState and updates the state", async () => {
    const { result } = renderHook(() => {
      return useSimpleUrlState({
        defaultValue: "off",
        name: "state",
        values: ["on", "off"],
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
      return useSimpleUrlState({
        defaultValue: "off",
        name: "state",
        values: ["on", "off"],
      });
    });

    const [firstState, setState] = result.current;
    expect(firstState).toEqual("off");

    act(() => {
      setState("" as any);
    });

    const [secondState] = result.current;
    expect(mockedPushState).toBeCalledTimes(1);
    expect(secondState).toEqual("off");
  });

  it("type custom", async () => {
    const { result } = renderHook(() => {
      return useSimpleUrlState<string>({
        type: "custom",
        name: "state",
        getState(urlSearchParams) {
          if (urlSearchParams.get("state") === null) return "off";
        },
        setState(urlSearchParams, value) {
          if (value === "off") {
            urlSearchParams.set("state", "");
            return urlSearchParams;
          }
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
});
