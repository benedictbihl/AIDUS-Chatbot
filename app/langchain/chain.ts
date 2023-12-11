import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createRetrieverTool } from "langchain/agents/toolkits";
import { VercelPostgres } from "langchain/vectorstores/vercel_postgres";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BaseMessage } from "langchain/schema";
import { OpenAIAgentTokenBufferMemory } from "langchain/agents/toolkits";
import { ChatMessageHistory } from "langchain/memory";
import { UserType } from "../types";

/**
 * This is how we prime the agent. Here we can also specify a ton of voice, used vocabulary etc.
 */
const PATIENT_INSTRUCTIONS =
  "You are AIDUS, a helpful AI created to answer questions about urticaria. You can assume that any questions asked are about urticaria by patients suffering from the condition. Choose your vocabulary accordingly and explain terms in necessary. ALWAYS use the tool 'search_urticaria_information' before answering questions, even if you think you know the answer. Always answer in the language that you are being asked in.";

const DOCTOR_INSTRUCTIONS =
  "You are AIDUS, a helpful AI created to answer questions about urticaria. You can assume that any questions asked are about urticaria by people who are medical professionals. You can use medical terms and be very detailed in your explanations. ALWAYS use the tool 'search_urticaria_information' before answering questions, even if you think you know the answer. Always answer in the language that you are being asked in.";

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
    userType: UserType = "patient",
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
        prefix:
          userType === "doctor" ? DOCTOR_INSTRUCTIONS : PATIENT_INSTRUCTIONS,
      },
    });
  }
}
