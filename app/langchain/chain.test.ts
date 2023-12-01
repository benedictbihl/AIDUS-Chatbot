import { Client } from "langsmith";
import { Example } from "langsmith/schemas";
import { LangChainTracer } from "langchain/callbacks";
import { ChainFactory } from "@/app/langchain/chain";
import pLimit from "p-limit";

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

  const limit = pLimit(10); // Limit concurrency to 10
  try {
    console.log("Running tests, this might take a while...");
    const chains = chainInputs.map((input, index) =>
      limit(async () => {
        //create new chain for each input with empty history and streaming set to false
        const chain = await ChainFactory.create([], false);
        return chain.invoke(input, configs[index]);
      })
    );

    await Promise.allSettled(chains);
  } catch (error) {
    console.log("Error running tests");
    console.log(error);
  }
}, 90_000); // 90 seconds timeout to allow for long running tests might need to be increased
