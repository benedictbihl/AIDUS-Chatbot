/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useChat, Message as MessageType } from "ai/react";

import { Sources } from "./components/Sources";
import { UserType } from "./types";
import languages from "../util/languages.json";
import { NavBar } from "./components/NavBar";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { ChatContainer } from "./components/ChatContainer";
import { Sidebar } from "./components/Sidebar";
import { Tabs } from "./components/Tabs";
import { Tooltip } from "react-tooltip";

export default function Chat() {
  const { isAboveMd } = useBreakpoint("md");
  const [showMenu, setShowMenu] = useState(false);
  const [userType, setUserType] = useState<UserType>("patient");
  const [tabIndex, setTabIndex] = useState(0);

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
    setShowMenu(isAboveMd);
  }, [isAboveMd]);

  useEffect(() => {
    //if data is available, switch to sources tab
    data && data.length > 0 && setTabIndex(1);
  }, [data]);

  return (
    <>
      <NavBar onMenuClick={() => setShowMenu(!showMenu)} />
      <div className="flex min-h-screen">
        <Sidebar showMenu={showMenu} className="z-10">
          <Tabs
            selectedIndex={tabIndex}
            onChange={(index) => setTabIndex(index)}
            tabNames={["Common Questions", "Sources"]}
            tabContent={[<></>, <Sources key={1} data={data} />]}
          />
        </Sidebar>
        <main className="mx-2 sm:mx-0 md:mx-auto absolute md:relative flex h-screen max-w-full flex-1 flex-col overflow-hidden">
          <h1 className="sr-only">AIDUS, the Urticaria Chatbot</h1>
          <ChatContainer
            messages={messages}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </main>
      </div>
      <Tooltip id="tooltip" />
    </>
  );
}
