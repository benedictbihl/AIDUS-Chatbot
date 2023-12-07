import {
  StreamingTextResponse,
  LangChainStream,
  experimental_StreamData,
} from "ai";
import { Document } from "langchain/document";
import { ChainFactory } from "@/app/langchain/chain";
import formatMessage from "@/util/formatMessage";
import { NextResponse } from "next/server";

export const runtime = "edge";

const PATIENT_INSTRUCTIONS =
  "You are AIDUS, a helpful AI created to answer questions about urticaria. You can assume that any questions asked are about urticaria by patients suffering from the condition. Choose your vocabulary accordingly and explain terms in necessary. ALWAYS use the tool 'search_urticaria_information' before answering questions, even if you think you know the answer.";

const DOCTOR_INSTRUCTIONS =
  "You are AIDUS, a helpful AI created to answer questions about urticaria. You can assume that any questions asked are about urticaria by people who are medical professionals. You can use medical terms and be very detailed in your explanations. ALWAYS use the tool 'search_urticaria_information' before answering questions, even if you think you know the answer.";

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
    const agentInstructions =
      body.userType === "doctor" ? DOCTOR_INSTRUCTIONS : PATIENT_INSTRUCTIONS;

    const data = new experimental_StreamData();
    const { stream, handlers } = LangChainStream({
      onFinal() {
        // IMPORTANT! We must close StreamData manually or the response will never finish.
        data.close();
      },
      experimental_streamData: true, // needed to return both the streamed response and the the sources
    });

    const executor = await ChainFactory.create(
      formattedPreviousMessages,
      true,
      agentInstructions,
    ); //set streaming to true

    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });

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
              resolveWithDocuments(documents);
            },
          },
        ],
      )
      .catch(console.error);

    const documents = await documentPromise;
    const serializedSources = Buffer.from(
      JSON.stringify(
        documents.map((doc) => {
          return {
            pageContent: doc.pageContent.slice(0, 50) + "...",
            metadata: doc.metadata,
          };
        }),
      ),
    ).toString("base64");
    data.append({
      sources: documents.map((doc) => ({
        contentChunk: doc.pageContent,
        metadata: doc.metadata,
      })),
    });
    return new StreamingTextResponse(
      stream,
      {
        headers: {
          "x-sources": serializedSources,
        },
      },
      data,
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
