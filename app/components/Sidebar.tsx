import { PropsWithChildren, useState } from "react";

type SidebarProps = PropsWithChildren & {
  className?: string;
  showMenu: boolean | undefined;
  onClickOutside: React.MouseEventHandler<HTMLElement>;
};
export const Sidebar = ({
  children,
  className,
  showMenu,
  onClickOutside,
}: SidebarProps) => {
  return (
    <aside
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName === "ASIDE") {
          onClickOutside(e);
        }
      }}
      //convoluted classnames to account for initial undefined state
      className={`${
        className ? className : ""
      } flex-shrink-0 overflow-x-hidden mt-headerOffset over mr-2
        ${showMenu === undefined && "w-0 md:w-[21rem]"}
        ${
          showMenu === true &&
          "transition-all ease-in-out duration-300 w-screen md:w-[21rem]"
        }
        ${
          showMenu === false &&
          "transition-all ease-in-out duration-300 w-0 md:w-0"
        }
    
        
      `}
    >
      <div className="w-[21rem] max-w-[90vw] h-[calc(100dvh-theme(height.header))] overflow-y-auto border-r-2 bg-gray-200 border-primary">
        {children}
      </div>
    </aside>
  );
};
