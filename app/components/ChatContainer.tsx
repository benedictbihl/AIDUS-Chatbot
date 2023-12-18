import { useEffect, useRef, ChangeEvent } from "react";
import { Button } from "./Button";
import { Message as MessageType } from "ai/react";
import { Message } from "./Message";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { pdf } from "@react-pdf/renderer";
import { PDF } from "./PDF";
import { saveAs } from "file-saver";
import { Sources } from "../types";

interface ChatContainerProps {
  messages: MessageType[];
  input: string;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  sources: Sources;
}

export const ChatContainer = ({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  sources,
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLLIElement>(null);
  // console.log(messages);
  // console.log(sources);
  useEffect(() => {
    //scroll window to bottom if it is not already at the bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className=" w-full overflow-y-auto flex flex-1 flex-col mt-[calc(0.5rem+theme(height.header))]">
        <ul className="mx-auto w-full md:max-w-2xl xl:max-w-3xl">
          {messages.length > 0
            ? messages.map((m) => (
                <Message
                  id={m.id}
                  key={m.id}
                  content={m.content}
                  role={m.role}
                />
              ))
            : null}
          <li aria-hidden ref={messagesEndRef} />
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full pt-2">
        <div className="last:mb-2 md:last:mb-6 md:mx-auto w-full md:max-w-2xl xl:max-w-3xl">
          <div className="w-full flex gap-1">
            <Button
              type="button"
              data-tooltip-id="tooltip"
              data-tooltip-content="Save Chat as PDF"
              appearance="secondary"
              className="py-2 px-3"
              onClick={async () => {
                const date = new Date().toLocaleDateString("en-GB");
                const blob = await pdf(
                  <PDF messages={messages} sources={sources} />,
                ).toBlob();
                saveAs(blob, "AIDUS_Conversation_" + date + ".pdf");
              }}
            >
              <ArrowDownTrayIcon className="h-8 w-8 text-textColor " />
              <span className="sr-only">Save Chat as PDF</span>
            </Button>
            <input
              type="text"
              placeholder="Ask..."
              className="grow px-4 border-primary-950 border-2 text-textColor focus:outline-none focus:ring-1 focus:ring-primary-950 ring-inset"
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Button
              className="p-4 w-28 bg-primary text-white font-semibold disabled:cursor-not-allowed disabled:bg-black hover:bg-primary-950 focus:outline-none focus:bg-primary-950"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Thinking...</span>
              ) : (
                <>Ask</>
              )}
              <span className="sr-only">Ask</span>
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
