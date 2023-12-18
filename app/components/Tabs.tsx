import classNames from "@/util/classNames";
import { Tab } from "@headlessui/react";
import { ReactNode } from "react";

interface TabProps {
  tabNames: string[];
  tabContent: ReactNode[];
  onChange: (index: number) => void;
  selectedIndex: number;
}
export const Tabs = ({
  tabNames,
  tabContent,
  onChange,
  selectedIndex,
}: TabProps) => {
  return (
    <Tab.Group
      selectedIndex={selectedIndex}
      onChange={(index) => onChange(index)}
    >
      <Tab.List className="flex">
        {tabNames.map((name, index) => (
          <Tab
            key={index}
            className={classNames(
              "flex-1 text-center py-2 text-primary font-semibold h-11 ring-2 ring-primary z-10 relative focus:outline-none focus:underline",
              index === selectedIndex
                ? "bg-secondary text-textColor"
                : "bg-white hover:bg-secondary-100",
            )}
          >
            {name}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {tabContent.map((content, index) => (
          <Tab.Panel className="focus:outline-none" key={index}>
            {content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};
