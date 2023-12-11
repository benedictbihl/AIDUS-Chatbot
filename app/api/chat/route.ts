import { StreamingTextResponse, LangChainStream } from "ai";
import { ChainFactory } from "@/app/langchain/chain";
import formatMessage from "@/util/formatMessage";
import { NextResponse } from "next/server";
import { Document } from "langchain/document";

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
    const { stream, handlers } = LangChainStream({});

    const executor = await ChainFactory.create(
      formattedPreviousMessages,
      true, //set streaming to true
      body.userType, // set the way the agent is primed based on the user type
    );

    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });
    let headers = { "x-sources": "" };

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
            handleRetrieverEnd(documents: Document[]) {
              // here we add the source docs to the response
              resolveWithDocuments(documents);
            },
            handleChainEnd() {
              // if the retriever is not called, we still need to resolve the promise
              resolveWithDocuments([]);
            },
          },
        ],
      )
      .catch(console.error);

    const docs = await documentPromise;
    const serializedSources = Buffer.from(
      JSON.stringify(
        docs.map((doc) => {
          return {
            pageContent: doc.pageContent.slice(0, 50) + "...",
            metadata: doc.metadata,
          };
        }),
      ),
    ).toString("base64");
    headers["x-sources"] = serializedSources;

    return new StreamingTextResponse(stream, {
      headers: headers,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
