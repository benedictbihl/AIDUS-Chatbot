import { Message as MessageType } from "ai";
import React from "react";

export const Message = ({ content, role }: MessageType) => {
  return (
    <div
      className={`flex my-4 ${role === "assistant" ? "" : "flex-row-reverse"}`}
    >
      <div
        className={`rounded-full border-2 h-14 w-14 bg-cover flex items-center justify-center
        ${
          role === "assistant"
            ? "border-secondary-300 bg-[url('/aidus.jpg')]  mr-4"
            : "border-primary-700 bg-primary-700 text-white ml-4"
        }`}
      >
        {role === "assistant" ? null : "YOU"}
      </div>
      <div
        className={`relative flex max-w-[75%]  p-4 ${
          role === "assistant"
            ? "self-start  bg-secondary-300 text-textColor"
            : "self-end bg-primary-700 text-white"
        }`}
      >
        <p>{content}</p>
        <div
          className={`absolute w-4 h-4 top-5 transform rotate-45 ${
            role === "assistant"
              ? "bg-secondary-300 -left-2"
              : "bg-primary-700 -right-2"
          }`}
        />
      </div>
    </div>
  );
};
