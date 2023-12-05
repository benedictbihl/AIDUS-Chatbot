import classNames from "@/util/classNames";
import React from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  children: React.ReactNode;
  className?: string;
};

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={classNames(
        "ml-2 p-4 w-36 bg-primary text-white font-semibold disabled:cursor-not-allowed disabled:bg-black hover:bg-primary-950 focus:bg-primary-950",
        className ? className : "",
      )}
      {...props}
    >
      {children}
    </button>
  );
};
