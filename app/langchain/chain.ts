import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createRetrieverTool } from "langchain/agents/toolkits";
import { VercelPostgres } from "langchain/vectorstores/vercel_postgres";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BaseMessage } from "langchain/schema";
import { OpenAIAgentTokenBufferMemory } from "langchain/agents/toolkits";
import { ChatMessageHistory } from "langchain/memory";
/**
 * This is how we prime the agent. Here we can also specify a ton of voice, used vocabulary etc.
 */
const PREFIX =
  "You are AIDUS, a helpful AI with access to a vast store of knowledge regarding urticaria. You can assume that any questions asked are about urticaria. Please ALWAYS use the tool 'search_urticaria_scientific_paper' before answering questions about urticaria.";

/**
 * This function returns the chain we are using for the chatbot.
 * @param formattedPreviousMessages The message history in the format expected by the agent
 * @param streaming Whether to use streaming or not. Disabled for testing, enabled for production.
 * @returns A promise that resolves to the agent executor
 * */
export async function getChain(
  formattedPreviousMessages: BaseMessage[],
  streaming = false
) {
  // Initialize the vector store
  const vectorStore = await VercelPostgres.initialize(new OpenAIEmbeddings(), {
    tableName: "urticaria_pdfs_cs1024",
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
    streaming: streaming,
  });
  const chatHistory = new ChatMessageHistory(formattedPreviousMessages);
  const memory = new OpenAIAgentTokenBufferMemory({
    llm: new ChatOpenAI({}),
    memoryKey: "chat_history",
    outputKey: "output",
    chatHistory,
  });

  // initialize the agent
  return initializeAgentExecutorWithOptions([tool], model, {
    agentType: "openai-functions",
    memory,
    returnIntermediateSteps: true,
    // verbose: true, // this will log the agent's internal state, including the tools used
    agentArgs: {
      prefix: PREFIX,
    },
  });
}
