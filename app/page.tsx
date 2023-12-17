/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef, useState } from "react";
import { useChat, Message as MessageType } from "ai/react";
import { Message } from "./components/Message";
import { Button } from "./components/Button";
import { Sources } from "./components/Sources";
import { UserType } from "./types";
import languages from "../util/languages.json";
import { NavBar } from "./components/NavBar";
import { useBreakpoint } from "./hooks/useBreakpoint";

export default function Chat() {
  const { isAboveMd } = useBreakpoint("md");
  const [userType, setUserType] = useState<UserType>("patient");
  const [showMenu, setShowMenu] = useState(true);
  const messagesEndRef = useRef<HTMLLIElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    data,
    setMessages,
  } = useChat({
    body: { userType: userType },
    onError(error) {
      console.error(error);
    },
  });

  useEffect(() => {
    const userType =
      (localStorage.getItem("userType") as UserType) || "patient";
    setUserType(userType);

    const initialMessages: MessageType[] = [
      {
        content:
          userType === "patient"
            ? "Greetings! I am AIDUS, an AI assistant with access to a vast store of knowledge regarding urticaria. I can answer questions you might have about your condition."
            : "Greetings! I am AIDUS, an AI assistant with access to a large body of scientific literature about urticaria. You can ask me specific questions about the condition and I will answer them as well as provide you with the sources of my information.",
        role: "assistant",
        id: "1",
      },
    ];

    //add language hint message if available
    const languageHint = Object.keys(languages).find((l) =>
      navigator.language.includes(l),
    ) as keyof typeof languages;

    if (languageHint && languageHint in languages) {
      initialMessages.push({
        content: languages[languageHint],
        role: "assistant",
        id: "2",
      });
    }
    // initialMessages.push(
    //   {
    //     content: "what is the cause of chronic urticaria",
    //     role: "user",
    //     id: "3",
    //   },
    //   {
    //     content:
    //       "The cause of chronic urticaria is not fully understood, but it is believed to involve an immune system response. Chronic urticaria is divided into chronic spontaneous urticaria (CSU) and chronic inducible urticarias (CIndUs). In CSU, wheals and/or angioedema occur suddenly and unpredictably without a specific trigger. The exact cause of this immune system response is not clear, but it may involve autoimmune factors, infections, or other underlying health conditions.It is important to consult with a healthcare professional to determine the specific cause of chronic urticaria in individual cases.",
    //     role: "assistant",
    //     id: "4",
    //   },
    //   {
    //     content: "what is the cause of chronic urticaria",
    //     role: "user",
    //     id: "5",
    //   },
    //   {
    //     content:
    //       "The cause of chronic urticaria is not fully understood, but it is believed to involve an immune system response. Chronic urticaria is divided into chronic spontaneous urticaria (CSU) and chronic inducible urticarias (CIndUs). In CSU, wheals and/or angioedema occur suddenly and unpredictably without a specific trigger. The exact cause of this immune system response is not clear, but it may involve autoimmune factors, infections, or other underlying health conditions.It is important to consult with a healthcare professional to determine the specific cause of chronic urticaria in individual cases.",
    //     role: "assistant",
    //     id: "6",
    //   },
    //   {
    //     content:
    //       "The cause of chronic urticaria is not fully understood, but it is believed to involve an immune system response. Chronic urticaria is divided into chronic spontaneous urticaria (CSU) and chronic inducible urticarias (CIndUs). In CSU, wheals and/or angioedema occur suddenly and unpredictably without a specific trigger. The exact cause of this immune system response is not clear, but it may involve autoimmune factors, infections, or other underlying health conditions.It is important to consult with a healthcare professional to determine the specific cause of chronic urticaria in individual cases.",
    //     role: "assistant",
    //     id: "7",
    //   },
    // );
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    //scroll window to bottom if it is not already at the bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setShowMenu(isAboveMd);
  }, [isAboveMd]);

  return (
    <>
      <NavBar onMenuClick={() => setShowMenu(!showMenu)} />

      <div className="flex min-h-screen">
        <Sources showMenu={showMenu} className="z-10" data={data} />
        <main className="mx-2 sm:mx-0 md:mx-auto absolute md:relative flex h-screen max-w-full flex-1 flex-col overflow-hidden">
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
          <form onSubmit={handleSubmit} className="flex w-full pt-2 pr-2">
            <div className="gap-3 last:mb-2 md:last:mb-6 md:mx-auto w-full md:max-w-2xl xl:max-w-3xl">
              <div className="w-full flex">
                <input
                  type="text"
                  placeholder="Ask..."
                  className="grow  px-4 border-primary-950 border-2 text-textColor focus:outline-none focus:ring-1 focus:ring-primary-950"
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
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
