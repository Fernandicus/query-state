import { renderHook, act } from "@testing-library/react";
import { useUrlMultiState } from "../src/lib/useUrlMultiState";

const updateSearchParams = vi.fn();

describe("On useUrlMultiState", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("setState calls pushState and updates the state", async () => {
    const now = Date.now().toString();
    const searchParams = new URLSearchParams();
    const { result } = renderHook(() => {
      return useUrlMultiState({
        searchParams,
        updateSearchParams,
        props: {
          name: "table",
          ids: {
            sort: {
              type: "simple",
              params: {
                defaultValue: "asc",
                values: ["desc", "asc", "idle"],
              },
            },
            filter: {
              type: "simple",
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
        },
      });
    });

    const { state, setState } = result.current;
    expect(state.value("filter")).toEqual("john");

    act(() => {
      setState("filter", "doe");
    });

    const secondResult = result.current;
    expect(updateSearchParams).toBeCalledTimes(1);
    expect(secondResult.state.value("filter")).toEqual("doe");
    expect(secondResult.state.value("from")).toEqual(now);
  });

  it("setState calls pushState and updates the state", async () => {
    const searchParams = new URLSearchParams();
    const { result } = renderHook(() => {
      return useUrlMultiState({
        searchParams,
        updateSearchParams,
        props: {
          name: "table",
          ids: {
            sort: {
              type: "simple",
              params: {
                defaultValue: "asc",
                values: ["desc", "asc", "idle"],
              },
            },
            filter: {
              type: "simple",
              params: {
                defaultValue: "",
                values: ["john", "doe"] as string[],
              },
            },
          },
        },
      });
    });

    const { setState } = result.current;

    act(() => {
      setState("filter", "");
    });

    const { state } = result.current;
    expect(updateSearchParams).toBeCalledTimes(1);
    expect(state.value("filter")).toEqual("");
    expect(state.is("filter", "")).toEqual(true);
  });
});
