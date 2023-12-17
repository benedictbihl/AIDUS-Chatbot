import { PropsWithChildren } from "react";
import classNames from "@/util/classNames";

type SidebarProps = PropsWithChildren & {
  className?: string;
  showMenu: boolean;
};
export const Sidebar = ({ children, className, showMenu }: SidebarProps) => {
  return (
    <aside
      className={classNames(
        className ? className : "",
        "transition-all ease-in-out duration-300 border-r-2 bg-gray-200 border-primary flex-shrink-0 overflow-x-hidden mt-headerOffset max-w-[90vw] over mr-2",
        showMenu ? "w-[21rem]" : "w-0",
      )}
    >
      <div className="w-[21rem] max-w-[90vw]">{children}</div>
    </aside>
  );
};
