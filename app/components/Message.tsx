import { Message as MessageType } from "ai";
import React, { useState, useEffect } from "react";
import classNames from "@/util/classNames";

export const Message = ({ content, role }: MessageType) => {
  const [assistantBackground, setAssistantBackground] = useState("");
  const [assistantBorder, setAssistantBorder] = useState("");

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType === "doctor") {
      setAssistantBackground("bg-tertiary-400");
      setAssistantBorder("border-tertiary-400");
    } else {
      setAssistantBackground("bg-primary-700");
      setAssistantBorder("border-primary-700");
    }
  }, []);

  return (
    <li
      className={`flex my-4 ${role === "assistant" ? "" : "flex-row-reverse"}`}
    >
      <div
        className={classNames(
          "rounded-full border-2 h-14 w-14 bg-cover flex items-center justify-center text-textColor font-bold",
          role === "assistant"
            ? `bg-[url('/aidus.jpg')] text-white mr-4 ${assistantBorder}`
            : "border-secondary-300  bg-secondary-300  ml-4",
        )}
      >
        {role === "assistant" ? null : "YOU"}
      </div>
      <div
        className={classNames(
          "relative flex max-w-[80%] md:max-w-[85%] p-4",
          role === "assistant"
            ? `self-start text-white ${assistantBackground}`
            : "self-end bg-secondary-300 text-textColor",
        )}
      >
        <p className="whitespace-pre-wrap">
          {content.length > 0 ? content : "I am processing your question..."}
        </p>
        <div
          className={classNames(
            "absolute w-4 h-4 top-5 transform rotate-45",
            role === "assistant"
              ? `-left-2 ${assistantBackground}`
              : "bg-secondary-300 -right-2",
          )}
        />
      </div>
    </li>
  );
};
