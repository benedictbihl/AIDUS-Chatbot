"use client";

import React, { useState, useEffect } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Select } from "./Select";
import { Dialog } from "./Dialog";

import { UserType } from "../types";

const values: { id: UserType; name: UserType }[] = [
  { id: "patient", name: "patient" },
  { id: "doctor", name: "doctor" },
];

export const NavBar = () => {
  const [selected, setSelected] = useState<{ id: UserType; name: UserType }>(
    values[0],
  );
  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);

  useEffect(() => {
    setSelected(
      values.find((value) => value.name === localStorage.getItem("userType")) ||
        values[0],
    );

    setWelcomeDialogOpen(
      sessionStorage.getItem("welcomeDialogOpen") === "false" ? false : true,
    );
  }, []);

  return (
    <nav className="w-full bg-primary h-header flex justify-between md:grid md:grid-cols-3 px-4 fixed top-0 z-50">
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
          onClick={() => setWelcomeDialogOpen(true)}
          className="focus:outline-none focus-within:ring-2 focus-within:ring-white"
        >
          <QuestionMarkCircleIcon className="h-8 w-8 text-white hover:text-secondary" />
        </button>
        <Dialog
          isOpen={welcomeDialogOpen}
          onClose={() => {
            sessionStorage.setItem("welcomeDialogOpen", "false");
            setWelcomeDialogOpen(false);
          }}
        />
      </div>
    </nav>
  );
};
