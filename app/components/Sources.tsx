import React, { Fragment } from "react";
import { Document } from "../types";

type SourcesProps = {
  data: { sources: Document[] }[];
};
export const Sources = ({ data }: SourcesProps) => {
  return data && data.length > 0 ? (
    <ul className="bg-gray-200 p-2 ring-gray-200 ring-2 overflow-auto max-h-[calc(100vh-7rem)]">
      {data.map((d, index) => (
        <Fragment key={index + "wrapper"}>
          {d.sources.map((s, index) => (
            <li
              className="my-4"
              key={s.metadata.pdf.info.Title + index ?? index}
            >
              <p className="font-semibold text-textColor">
                {s.metadata.pdf.info.Title ?? "MISSING TITLE"}
              </p>
              <p>
                {s.metadata.pdf.info.Author ?? "MISSING AUTHOR"},{" "}
                <span className="italic">p. {s.metadata.loc.pageNumber}</span>
              </p>
            </li>
          ))}
        </Fragment>
      ))}
    </ul>
  ) : (
    <div className="p-2">No sources referenced for this conversation.</div>
  );
};
