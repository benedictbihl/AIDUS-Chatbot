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

const PREFIX =
  "You are AIDUS, a helpful AI with access to a vast store of knowledge regarding urticaria, a skin condition. You can assume that any questions asked are about urticaria. Please answer them using any tools available to you.";

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages ?? [];
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const currentMessageContent = messages[messages.length - 1].content;

  const { stream, handlers } = LangChainStream();

  const vectorStore = await VercelPostgres.initialize(
    new OpenAIEmbeddings(),
    {}
  );

  const retriever = vectorStore.asRetriever();

  const tool = createRetrieverTool(retriever, {
    name: "search_state_of_union",
    description:
      "Searches and returns documents regarding the state-of-the-union.",
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

  const executor = await initializeAgentExecutorWithOptions([tool], model, {
    agentType: "openai-functions",
    memory,
    returnIntermediateSteps: true,
    agentArgs: {
      prefix: PREFIX,
    },
  });

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
