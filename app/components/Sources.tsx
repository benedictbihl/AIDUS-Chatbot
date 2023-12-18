import React, { Fragment } from "react";
import { Sources as SourcesType } from "../types";

type SourcesProps = {
  sources: SourcesType;
};
export const Sources = ({ sources }: SourcesProps) => {
  return sources && sources.length > 0 ? (
    <ul className="bg-gray-200 p-2 ring-gray-200 ring-2 overflow-auto max-h-[calc(100vh-7rem)]">
      {sources.map((d, index) => (
        <Fragment key={index + "wrapper"}>
          {d.sources.map((s, index) => (
            <li
              className="p-2"
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
    <div className="p-4">No sources referenced for this conversation.</div>
  );
};
