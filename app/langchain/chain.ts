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
  "You are AIDUS, a helpful AI created to answer questions about urticaria. You can assume that any questions asked are about urticaria. ALWAYS use the tool 'search_urticaria_information' before answering questions, even if you think you know the answer.";

/**
 * This function returns the chain we are using for the chatbot.
 * @param formattedPreviousMessages The message history in the format expected by the agent
 * @param streaming Whether to use streaming or not. Disabled for testing, enabled for production.
 * @returns A promise that resolves to the agent executor
 * */

export class ChainFactory {
  static async create(
    formattedPreviousMessages: BaseMessage[],
    streaming = false,
    agentInstructions: string = PREFIX, // if no instructions are provided, use the default PREFIX
  ) {
    const vectorStore = await VercelPostgres.initialize(
      new OpenAIEmbeddings(),
      {
        tableName: process.env.EMBEDDINGS_TABLE_NAME,
      },
    );

    const retriever = vectorStore.asRetriever();
    const tool = createRetrieverTool(retriever, {
      name: "search_urticaria_information",
      description:
        "Searches and returns documents regarding urticaria from a body of scientific papers.",
    });

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo-1106",
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

    return initializeAgentExecutorWithOptions([tool], model, {
      agentType: "openai-functions",
      memory,
      returnIntermediateSteps: true,
      agentArgs: {
        prefix: agentInstructions,
      },
    });
  }
}
