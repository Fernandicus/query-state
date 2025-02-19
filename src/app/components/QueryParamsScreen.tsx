import React, { useMemo } from "react";
import { useSearchParams } from "react-router";
import { useUrlColorState } from "../hooks/useUrlColorsState";
import { useUrlSizeState } from "../hooks/useUrlSizeState";
import { formContext } from "../FormStateProvider";

export function QueryParamsScreen() {
  const [searchParams] = useSearchParams();

  const ctx = formContext();
  const { colorsState } = useUrlColorState();
  const { sizeState } = useUrlSizeState();

  const validatedState = useMemo(() => {
    return {
      colors: [colorsState.value].flat(),
      size: sizeState,
      "input.title": ctx.title,
      "input.shape": ctx.shape,
    };
  }, [colorsState.value, sizeState, ctx]);

  return (
    <div className="query-params__wrapper">
      <h1
        style={{
          fontSize: "22px",
        }}
      >
        URL query params
      </h1>

      <div className="query-params__container">
        {searchParams.toString().length > 0 ? (
          <p
            dangerouslySetInnerHTML={{
              __html: decodeURIComponent(searchParams.toString())
                .split("&")
                .map((s) => {
                  const v = s.split("=");
                  const v1 = v[0].split(",");
                  const v2 = v[1].split(",");

                  if (v2.length > 1) return [v1, `[ ${v2.join(" , ")} ]`].join(" = ");
                  return [v1, v2].join(" = ");
                })
                .join("<br/><br/>"),
            }}
          ></p>
        ) : (
          <p className="query-params__container--empty">No query params</p>
        )}
      </div>

      <h1
        style={{
          fontSize: "22px",
        }}
      >
        Validated query params
      </h1>
      <div className="query-params__container">
        <p
          dangerouslySetInnerHTML={{
            __html: Object.entries(validatedState)
              .map(([k, v]) => {
                if (Array.isArray(v)) {
                  return `${k} = [ ${v.join(" , ")} ] `;
                }
                return `${k} = ${v} `;
              })
              .join("<br/><br/>"),
          }}
        ></p>
      </div>

      <div className="query-params__info">
        <p>ℹ️ Try playing around with url query params directly by hand to see the validation process in action</p>
      </div>
    </div>
  );
}
