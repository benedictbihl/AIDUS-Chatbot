import {
  StreamingTextResponse,
  LangChainStream,
  experimental_StreamData,
} from "ai";
import { ChainFactory } from "@/app/langchain/chain";
import formatMessage from "@/util/formatMessage";
import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * This is the main function that is called when a user sends a message.
 * It takes in the message history, and  the current message, and returns
 * a response.
 * @param req The request object
 * @returns A streaming response
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const data = new experimental_StreamData();
    const { stream, handlers } = LangChainStream({
      experimental_streamData: true, // needed to return both the streamed response and the the sources
    });

    const executor = await ChainFactory.create(
      formattedPreviousMessages,
      true, //set streaming to true
      body.userType, // set the way the agent is primed based on the user type
    );

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
              data.close();
            },
          },
        ],
      )
      .catch(console.error);

    return new StreamingTextResponse(stream, {}, data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
