import { createConversationalRetrievalAgent } from "langchain/agents/toolkits";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createRetrieverTool } from "langchain/agents/toolkits";
import { VercelPostgres } from "langchain/vectorstores/vercel_postgres";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { AIMessage, HumanMessage } from "langchain/schema";
import { StreamingTextResponse, LangChainStream, Message } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
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

  const executor = await createConversationalRetrievalAgent(model, [tool], {
    verbose: true,
  });

  executor
    .call(
      {
        //FIX HERE
        input: (messages as Message[]).map((m) =>
          m.role == "user"
            ? new HumanMessage(m.content)
            : new AIMessage(m.content)
        ),
      },
      [handlers]
    )
    .catch(console.error);

  return new StreamingTextResponse(stream);
}
