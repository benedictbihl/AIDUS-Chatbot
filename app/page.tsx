/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useChat, Message as MessageType } from "ai/react";

import { Sources } from "./components/Sources";
import { Sources as SourcesType, UserType } from "./types";
import languages from "../util/languages.json";
import { NavBar } from "./components/NavBar";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { ChatContainer } from "./components/ChatContainer";
import { Sidebar } from "./components/Sidebar";
import { Tabs } from "./components/Tabs";
import { Tooltip } from "react-tooltip";
import { FAQ } from "./components/FAQ";

export default function Chat() {
  const { isAboveMd } = useBreakpoint("md");
  const [showMenu, setShowMenu] = useState<boolean | undefined>();
  const [userType, setUserType] = useState<UserType>("patient");
  const [userHasSentMessage, setUserHasSentMessage] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [sources, setSources] = useState<SourcesType>();

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
      alert("An error occurred. Please reload the page and try again");
    },
    onResponse() {
      //set to true after first real message is sent by user
      setUserHasSentMessage(true);
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
            ? "Greetings! I am AIDUS, an AI assistant with access to a vast store of knowledge regarding urticaria. I can answer questions you might have about your condition, or you can pick one of the common questions from the sidebar to get started."
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

    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    setShowMenu(isAboveMd);
  }, [isAboveMd]);

  useEffect(() => {
    if (data && data.length > 0) {
      //if data is available, switch to sources tab
      setTabIndex(1);
      //if sources are already loaded, append new sources
      if (sources && sources.length <= data.length) {
        const newSources = data.slice(data.length - 1);
        //@ts-ignore
        setSources((prev) => [...prev, ...newSources]);
      } else setSources(data);
    }
  }, [data && data.length]);

  return (
    <>
      <NavBar onMenuClick={() => setShowMenu(!showMenu)} />
      <div className="flex h-[100dvh] overflow-hidden">
        <Sidebar
          onClickOutside={() => setShowMenu(false)}
          showMenu={showMenu}
          className="z-10 absolute md:relative"
        >
          <Tabs
            selectedIndex={tabIndex}
            onChange={(index) => setTabIndex(index)}
            tabNames={["Common Questions", "Sources"]}
            tabContent={[
              <FAQ
                key={0}
                onQuestionSelect={(e, q) => {
                  if (!isLoading) {
                    if (userHasSentMessage) {
                      const confirmed = confirm(
                        "Selecting another question will reset your chat with AIDUS. Are you sure you want to continue?",
                      );
                      if (!confirmed) return;
                    }
                    setMessages(q.conversation_history);
                    setSources(q.sources);
                    !isAboveMd && setShowMenu(false);
                  }
                }}
              />,
              <Sources key={1} sources={sources} />,
            ]}
          />
        </Sidebar>
        <main className="mx-2 sm:mx-0 md:mx-auto flex  max-w-full flex-1 flex-col overflow-hidden">
          <h1 className="sr-only">AIDUS, the Urticaria Chatbot</h1>
          <ChatContainer
            messages={messages}
            sources={sources}
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
