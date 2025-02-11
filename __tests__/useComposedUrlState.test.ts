import { renderHook, act } from "@testing-library/react";
import { useComposedUrlState } from "../src/useComposedUrlState";

const mockedPushState = vi.fn();

vi.spyOn(window, "location", "get").mockReturnValue({
  ...window.location,
  search: "?some=query",
});

vi.spyOn(window, "history", "get").mockReturnValue({
  ...window.history,
  pushState: mockedPushState,
});

describe("On useComposedUrlState", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("setState calls pushState and updates the state", async () => {
    const now = Date.now().toString();
    const { result } = renderHook(() => {
      return useComposedUrlState({
        key: "table",
        ids: {
          sort: {
            params: {
              defaultValue: "asc",
              values: ["desc", "asc", "idle"],
            },
          },
          filter: {
            params: {
              defaultValue: "john",
              values: ["john", "doe"],
            },
          },
          from: {
            type: "custom",
            params: {
              getState() {
                return now;
              },
            },
          },
        },
      });
    });

    const [firstState, setState] = result.current;
    expect(firstState.get("filter")).toEqual("john");

    act(() => {
      setState.set("filter", "doe");
    });

    const [secondState] = result.current;
    expect(mockedPushState).toBeCalledTimes(1);
    expect(secondState.get("filter")).toEqual("doe");
    expect(secondState.get("from")).toEqual(now);
  });

  it("setState calls pushState and updates the state", async () => {
    const { result } = renderHook(() => {
      return useComposedUrlState({
        key: "table",
        ids: {
          sort: {
            params: {
              defaultValue: "asc",
              values: ["desc", "asc", "idle"],
            },
          },
          filter: {
            params: {
              defaultValue: "",
              values: ["john", "doe"] as string[],
            },
          },
        },
      });
    });

    const [_, setState] = result.current;

    act(() => {
      setState.set("filter", "");
    });

    const [secondState] = result.current;
    expect(mockedPushState).toBeCalledTimes(1);
    expect(secondState.get("filter")).toEqual("");
  });
});
