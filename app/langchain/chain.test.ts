import { Client } from "langsmith";
import { Example } from "langsmith/schemas";
import { LangChainTracer } from "langchain/callbacks";
import { ChainFactory } from "@/app/langchain/chain";

function getConfigs(examples: Example[], projectName?: string) {
  return examples.map((example) => {
    return {
      callbacks: [new LangChainTracer({ exampleId: example.id, projectName })],
    };
  });
}

const datasetName = "AIDUS-100-question_v3";
test(`"Test run on ${datasetName}`, async () => {
  const client = new Client();
  const chain = ChainFactory.create([], true); //empty chat history for testing
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
  console.log(chainInputs.length);

  (await chain).batch(chainInputs, configs, { maxConcurrency: 1 });
  // (await chain).batch(chainInputs, configs);
}, 1000_000); // 60 seconds timeout to allow for long running tests might need to be increased
