import classNames from "@/util/classNames";
import React from "react";

type ButtonProps = React.ComponentPropsWithRef<"button"> & {
  appearance?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, appearance = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={classNames(
          "font-semibold disabled:cursor-not-allowed disabled:bg-black ",
          className ? className : "",
          appearance === "primary"
            ? "bg-primary text-white hover:bg-primary-950 focus:outline-none focus:bg-primary-950 focus-within:ring-2 focus-within:ring-white"
            : "bg-white ring-inset ring-2 ring-textColor text-textColor hover:bg-gray-200 focus:outline-none focus:bg-gray-200",
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
