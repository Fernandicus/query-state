import React from "react";
import { useSearchParams } from "react-router";

export function QueryParamsScreen() {
  const [searchParams] = useSearchParams();

  return (
    <div className="flex-col">
      <h1
        style={{
          fontSize: "22px",
        }}
      >
        Try playing around with url query params directly by hand
      </h1>

      <div className="query-params-container">
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
          <p className="query-params-container__empty">No query params</p>
        )}
      </div>
    </div>
  );
}
