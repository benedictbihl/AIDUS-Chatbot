"use client";

import React, { useState } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Select } from "./Select";
import { Dialog } from "./Dialog";

const values = [
  { id: "patient", name: "patient" },
  { id: "doctor", name: "doctor" },
];

export const NavBar = () => {
  const [selected, setSelected] = useState(
    values.find((value) => value.name === localStorage.getItem("userType")) ||
      values[0],
  );

  let [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="w-full bg-primary h-header grid grid-cols-3 px-4 fixed top-0 z-50">
      <div className="group self-center">
        <a
          href="https://ga2len-ucare.com/"
          className="flex w-fit items-center text-white font-bold group-hover:text-secondary focus:outline-none focus:ring-2 focus:ring-white"
        >
          <ArrowLeftIcon className="pr-2 h-8 w-8 text-white group-hover:text-secondary" />
          <span className="hidden md:block">Back to UCARE</span>
        </a>
      </div>
      <Select
        className="self-center justify-self-center h-full"
        label="I am a"
        selected={selected}
        values={values}
        onChange={(selected) => {
          confirm(
            "Are you sure you want to change your user type? This will reset your chat with AIDUS.",
          );
          localStorage.setItem("userType", selected.name);
          setSelected(selected);
          window.location.reload();
        }}
      />

      <div className="flex items-center justify-end">
        <button
          onClick={() => setIsOpen(true)}
          className="focus:outline-none focus-within:ring-2 focus-within:ring-white"
        >
          <QuestionMarkCircleIcon className="h-8 w-8 text-white hover:text-secondary" />
        </button>
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </nav>
  );
};
