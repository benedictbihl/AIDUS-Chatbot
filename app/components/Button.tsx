import classNames from "@/util/classNames";
import React from "react";

type ButtonProps = React.ComponentPropsWithRef<"button"> & {
  children: React.ReactNode;
  className?: string;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={classNames(
          "ml-2 p-4 w-36 bg-primary text-white font-semibold disabled:cursor-not-allowed disabled:bg-black hover:bg-primary-950 focus:outline-none focus:bg-primary-950",
          className ? className : "",
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
