"use client";
import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Message } from "./components/Message";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [
        {
          content:
            "Greetings! I am AIDUS, an AI assistant with access to a vast store of knowledge regarding urticaria, a skin condition. I can help answer any questions you have about urticaria.",
          role: "assistant",
          id: "1",
        },
      ],
    });

  const [scrollHeight] = useState(
    typeof window !== "undefined" ? document.body.scrollHeight : 0
  );

  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //scroll window to bottom on new message
    if (
      chatListRef.current!.scrollHeight > scrollHeight &&
      typeof window !== "undefined"
    ) {
      window.scrollTo({
        top: scrollHeight + 100,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <main className="flex flex-col">
      <div
        ref={chatListRef}
        className="mx-auto w-full max-w-3xl pt-12 mb-[108px] flex flex-col stretch"
      >
        {messages.length > 0
          ? messages.map((m) => (
              <Message id={m.id} key={m.id} content={m.content} role={m.role} />
            ))
          : null}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex fixed left-0 bottom-0 pt-4 pb-[36px] w-3xl bg-white w-full"
      >
        <div className="flex w-full px-4 md:w-[48rem] mx-auto">
          <input
            type="text"
            placeholder="Ask..."
            className="grow px-4 border-primary-950 border-2 text-textColor"
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            className="ml-2 p-4 w-36 bg-primary text-white font-semibold disabled:cursor-not-allowed disabled:bg-black hover:bg-primary-950 focus:bg-primary-950"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse">Thinking...</span>
            ) : (
              <>Ask Question</>
            )}
            <span className="sr-only">Ask</span>
          </button>
        </div>
      </form>
    </main>
  );
}
