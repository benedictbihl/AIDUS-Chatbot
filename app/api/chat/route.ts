import { AIMessage, HumanMessage } from "langchain/schema";
import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  LangChainStream,
  experimental_StreamData,
} from "ai";

import { ChainFactory } from "@/app/langchain/chain";

export const runtime = "edge";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
  if (message.role === "user") return new HumanMessage(message.content);
  return new AIMessage(message.content);
};

/**
 * This is the main function that is called when a user sends a message.
 * It takes in the message history, and  the current message, and returns
 * a response.
 * @param req The request object
 * @returns A streaming response
 */
export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages ?? [];
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const currentMessageContent = messages[messages.length - 1].content;

  const data = new experimental_StreamData();
  const { stream, handlers } = LangChainStream({
    onFinal() {
      // IMPORTANT! We must close StreamData manually or the response will never finish.
      data.close();
    },
    experimental_streamData: true, // needed to return both the streamed response and the the sources
  });

  const executor = await ChainFactory.create(formattedPreviousMessages, true); //set streaming to true

  /* run the agent - it autonomously decides if it needs to call
   * the retriever or the llm directly, depending on the query
   */
  executor
    .call(
      {
        input: currentMessageContent,
      },
      [
        handlers,
        {
          handleRetrieverEnd(documents) {
            // here we add the source docs to the response
            data.append({
              sources: documents.map((doc) => ({
                contentChunk: doc.pageContent,
                metadata: doc.metadata,
              })),
            });
          },
        },
      ]
    )
    .catch(console.error);

  return new StreamingTextResponse(stream, {}, data);
}
