import { Message as VercelChatMessage } from "ai";
import { AIMessage, HumanMessage } from "langchain/schema";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
export default function formatMessage(message: VercelChatMessage) {
  if (message.role === "user") return new HumanMessage(message.content);
  return new AIMessage(message.content);
}
