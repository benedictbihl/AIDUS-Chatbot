"use client";

import React, { useState, useEffect } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Select } from "./Select";
import { Dialog } from "./Dialog";
import { UserType } from "../types";
import { Button } from "./Button";

const values: { id: UserType; name: UserType }[] = [
  { id: "patient", name: "patient" },
  { id: "doctor", name: "doctor" },
];

type NavBarProps = {
  onMenuClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const NavBar = ({ onMenuClick }: NavBarProps) => {
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
    <nav className="w-full bg-primary h-header flex justify-between md:grid md:grid-cols-2 fixed top-0 z-50 ">
      <Button
        data-tooltip-id="tooltip"
        data-tooltip-content="Open/Close sidebar"
        onClick={(e) => onMenuClick(e)}
        className="h-full w-fit px-4 ring-inset"
      >
        <Bars3Icon className="h-8 w-8 text-white " />
        <span className="sr-only">Open sidebar</span>
      </Button>

      <div className="flex items-center justify-end">
        <Select
          className="self-center justify-self-center h-full pr-2"
          label="I am a"
          selected={selected}
          values={values}
          onChange={(selected) => {
            const confirmed = confirm(
              "Are you sure you want to change your user type? This will reset your chat with AIDUS.",
            );
            if (!confirmed) return;
            localStorage.setItem("userType", selected.name);
            setSelected(selected);
            window.location.reload();
          }}
        />

        <a
          className="font-bold h-full px-4 ring-inset hidden md:flex items-center bg-primary text-white hover:bg-primary-950  focus:bg-primary-950 focus-within:ring-2 focus-within:ring-white focus:outline-none"
          href="https://ga2len-ucare.com/"
        >
          <span>Visit UCARE</span>
        </a>

        <Button
          data-tooltip-id="tooltip"
          data-tooltip-content="Show help dialog"
          onClick={() => setWelcomeDialogOpen(true)}
          className="h-full px-4 ring-inset"
        >
          <QuestionMarkCircleIcon className="h-8 w-8 text-white " />
          <span className="sr-only">Show help dialog</span>
        </Button>
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
