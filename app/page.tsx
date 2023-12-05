/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Message } from "./components/Message";
import { Button } from "./components/Button";
import { Sources } from "./components/Sources";

export default function Chat() {
  const userType = localStorage.getItem("userType") || "patient";

  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      initialMessages: [
        {
          content:
            userType === "patient"
              ? "Greetings! I am AIDUS, an AI assistant with access to a vast store of knowledge regarding urticaria, a skin condition. I can help answer any questions you have about urticaria."
              : "Greetings! I am AIDUS, an AI assistant with access to a large body of scientific literature about urticaria. You can ask me specific questions about the condition and i will answer them as well as provide you with the sources of my information.",
          role: "assistant",
          id: "1",
        },
      ],
    });

  useEffect(() => {
    data && data.length > 0 && console.log(data);
  }, [isLoading]);

  const [scrollHeight] = useState(
    typeof window !== "undefined" ? document.body.scrollHeight : 0,
  );

  const chatListRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   //scroll window to bottom on new message
  //   if (
  //     chatListRef.current!.scrollHeight > scrollHeight &&
  //     typeof window !== "undefined"
  //   ) {
  //     window.scrollTo({
  //       top: scrollHeight + 100,
  //       behavior: "smooth",
  //     });
  //   }
  // }, [messages]);

  return (
    <main className="flex flex-col">
      <div
        ref={chatListRef}
        className="mx-auto w-full max-w-4xl mb-[108px] flex flex-col mt-[calc(2rem+theme(height.header))] px-2"
      >
        {messages.length > 0
          ? messages.map((m) => (
              <Message id={m.id} key={m.id} content={m.content} role={m.role} />
            ))
          : null}
      </div>
      <Sources
        className="fixed  col-start-1 row-start-1 mt-headerOffset"
        data={data}
      />
      <form
        onSubmit={handleSubmit}
        className="flex fixed left-0 bottom-0 pt-4 pb-[36px] w-4xl bg-white w-full px-2"
      >
        <div className="flex w-full md:w-[56rem] mx-auto">
          <input
            type="text"
            placeholder="Ask..."
            className="grow px-4 border-primary-950 border-2 text-textColor focus:outline-none focus:ring-1 focus:ring-primary-950"
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Button
            className="p-4 w-36 bg-primary text-white font-semibold disabled:cursor-not-allowed disabled:bg-black hover:bg-primary-950 focus:outline-none focus:bg-primary-950"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse">Thinking...</span>
            ) : (
              <>Ask Question</>
            )}
            <span className="sr-only">Ask</span>
          </Button>
        </div>
      </form>
    </main>
  );
}
