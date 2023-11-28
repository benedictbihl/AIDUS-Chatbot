import { Client } from "langsmith";
import { Example } from "langsmith/schemas";
import { LangChainTracer } from "langchain/callbacks";
import { getChain } from "@/app/langchain/chain";

function getConfigs(examples: Example[], projectName?: string) {
  return examples.map((example) => {
    return {
      callbacks: [new LangChainTracer({ exampleId: example.id, projectName })],
    };
  });
}

const datasetName = "test-dataset";
test(`"Test run on ${datasetName}`, async () => {
  const client = new Client();
  const chain = getChain([], true); //empty chat history for testing
  const examples: Example[] = [];
  for await (const example of client.listExamples({ datasetName })) {
    examples.push(example);
  }

  const projectName =
    (process.env.LANGCHAIN_PROJECT ?? "Unit Testing") +
    "_" +
    datasetName +
    "_" +
    new Date().toISOString().replace("T", "_").substring(0, 19);

  const configs = getConfigs(examples, projectName);
  const chainInputs = examples.map((example) => example.inputs);
  // delete chatHistory from chainInputs
  chainInputs.forEach((input) => {
    delete input.chat_history;
  });
  (await chain).batch(chainInputs, configs);
}, 60_000); // 60 seconds timeout to allow for long running tests might need to be increased
