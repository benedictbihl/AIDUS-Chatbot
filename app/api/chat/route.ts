import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createRetrieverTool } from "langchain/agents/toolkits";
import { VercelPostgres } from "langchain/vectorstores/vercel_postgres";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { AIMessage, HumanMessage } from "langchain/schema";
import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  LangChainStream,
} from "ai";
import { OpenAIAgentTokenBufferMemory } from "langchain/agents/toolkits";
import { ChatMessageHistory } from "langchain/memory";

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
 * This is how we prime the agent. Here we can also specify a ton of voice, used vocabulary etc.
 */
const PREFIX =
  "You are AIDUS, a helpful AI with access to a vast store of knowledge regarding urticaria, a skin condition. You can assume that any questions asked are about urticaria. Please answer them using any tools available to you.";

/**
 * This is the main function that is called when a user sends a message.
 * It takes in the message history, and the current message, and returns
 * a response.
 * @param req The request object
 * @returns A streaming response
 */
export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages ?? [];
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const currentMessageContent = messages[messages.length - 1].content;

  const { stream, handlers } = LangChainStream(); //easy helper to create a stream

  // Initialize the vector store
  const vectorStore = await VercelPostgres.initialize(new OpenAIEmbeddings(), {
    tableName: "langchain_pg_embedding",
    columns: {
      idColumnName: "uuid",
      vectorColumnName: "embedding",
      contentColumnName: "document",
      metadataColumnName: "cmetadata",
    },
  });

  // prepare the agent with a retriever, llm and memory
  const retriever = vectorStore.asRetriever();
  const tool = createRetrieverTool(retriever, {
    name: "search_urticaria_scientific_paper",
    description:
      "Searches and returns documents regarding urticaria from a body of scientific papers.",
  });
  const model = new ChatOpenAI({
    temperature: 0,
    streaming: true,
  });
  const chatHistory = new ChatMessageHistory(formattedPreviousMessages);
  const memory = new OpenAIAgentTokenBufferMemory({
    llm: new ChatOpenAI({}),
    memoryKey: "chat_history",
    outputKey: "output",
    chatHistory,
  });

  // initialize the agent
  const executor = await initializeAgentExecutorWithOptions([tool], model, {
    agentType: "openai-functions",
    memory,
    // returnIntermediateSteps: true,
    verbose: true, // this will log the agent's internal state, including the tools used
    agentArgs: {
      prefix: PREFIX,
    },
  });

  /* run the agent - it autonomously decides if it needs to call
   * the retriever or the llm directly, depending on the query
   */
  executor
    .call(
      {
        input: currentMessageContent,
      },
      [handlers]
    )
    .catch(console.error);

  return new StreamingTextResponse(stream);
}
