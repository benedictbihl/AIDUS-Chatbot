import React, { Fragment, useState } from "react";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";
import classNames from "@/util/classNames";

type Document = {
  contentChunk: string;
  metadata: {
    loc: {
      lines: {
        to: number;
        from: number;
      };
      pageNumber: number;
    };
    pdf: {
      info: {
        Title: string;
        Author: string;
      };
      version: string;
      metadata: {
        _metadata: {
          [key: string]: string | boolean;
        };
      };
      totalPages: number;
    };
  };
};

type SourcesProps = {
  className?: string;
  data: { sources: Document[] }[];
};
export const Sources = ({ data, className }: SourcesProps) => {
  const [showSources, setShowSources] = useState(false);
  return (
    <aside
      className={classNames(
        className ? className : "",
        "transition-transform ease-in-out duration-300",
        showSources ? "translate-x-0 mx-6" : "-translate-x-full",
      )}
    >
      <div className={classNames("mt-2 md:mt-12 w-[30rem] max-w-[90vw] over")}>
        <h2 className="flex justify-between items-center text-primary bg-white h-11 ring-2 ring-primary z-10 font-semibold text-2xl relative after:h-3 after:bg-secondary-300 after:w-full after:absolute after:block after:bottom-2 after:-z-10">
          <span className="relative left-7">Sources</span>
          <button
            onClick={() => setShowSources(!showSources)}
            className={classNames(
              showSources ? "-left-7" : "absolute left-full",
              "bg-white h-full group focus:outline-none",
            )}
          >
            <span className="h-full text-sm flex items-center ring-2 ring-primary pl-2 group group-hover:bg-primary group-hover:text-white group-focus-within:bg-primary group-focus-within:text-white">
              {showSources ? "Close" : "Sources"}
              <ChevronDoubleLeftIcon
                className={classNames(
                  "h-6 w-6 text-primary group-focus-within:text-white group-hover:text-white",
                  showSources ? "" : "rotate-180",
                )}
              />
            </span>
          </button>
        </h2>
        <ul className="bg-gray-200 p-2 ring-gray-200 ring-2 overflow-auto max-h-[calc(100vh-16rem)]">
          {data && data.length > 0
            ? data.map((d, index) => (
                <Fragment key={index + "wrapper"}>
                  {d.sources.map((s, index) => (
                    <li
                      className="my-4"
                      key={s.metadata.pdf.info.Title ?? index}
                    >
                      <p className="font-semibold text-textColor">
                        {s.metadata.pdf.info.Title ?? "MISSING TITLE"}
                      </p>
                      <p>
                        {s.metadata.pdf.info.Author ?? "MISSING AUTHOR"},{" "}
                        <span className="italic">
                          p. {s.metadata.loc.pageNumber}
                        </span>
                      </p>
                    </li>
                  ))}
                </Fragment>
              ))
            : "No sources referenced for this conversation."}
        </ul>
      </div>
    </aside>
  );
};
