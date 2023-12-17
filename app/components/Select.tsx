"use client";

import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import classNames from "@/util/classNames";
import { UserType } from "../types";

type SelectProps = {
  className?: string;
  label: string;
  values: { id: UserType; name: UserType }[];
  onChange: (value: { id: UserType; name: UserType }) => void;
  selected: { id: string; name: string };
};

export const Select = ({
  className,
  selected,
  label,
  values,
  onChange,
}: SelectProps) => {
  return (
    <Listbox value={selected} onChange={onChange}>
      {({ open }) => (
        <div
          className={classNames(
            "flex items-baseline text-white font-bold group",
            className ? className : "",
          )}
        >
          <Listbox.Label className="pr-1">{label}</Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default py-1.5 pl-1 pr-6 text-left text-white shadow-sm focus:outline-none focus-within:ring-2 focus-within:ring-white sm:text-md sm:leading-6">
              <span className="flex items-center">
                <span className=" block truncate group-hover:text-secondary">
                  {selected.name}
                </span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-white group-hover:text-secondary"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-[100px] overflow-auto  bg-white py-1  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {values.map((value) => (
                  <Listbox.Option
                    key={value.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-primary text-white" : "text-textColor",
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                      )
                    }
                    value={value}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              selected ? "font-bold" : "font-normal",
                              "block truncate",
                            )}
                          >
                            {value.name}
                          </span>
                        </div>
                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-primary",
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
};
