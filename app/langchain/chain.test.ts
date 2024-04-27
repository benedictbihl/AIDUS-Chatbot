import { Client } from "langsmith";
import { Example } from "langsmith/schemas";
import { LangChainTracer } from "langchain/callbacks";
import { ChainFactory } from "@/app/langchain/chain";
import pLimit from "p-limit";
import { select, input, confirm } from "@inquirer/prompts";
import { UserType } from "../types";

function getConfigs(examples: Example[], projectName?: string) {
  return examples.map((example) => {
    return {
      callbacks: [new LangChainTracer({ exampleId: example.id, projectName })],
    };
  });
}

if (
  !process.env.LANGSMITH_TEST_DATASET_NAME &&
  !process.env.LANGCHAIN_PROJECT
) {
  throw new Error(
    "Please set the LANGSMITH_TEST_DATASET_NAME and LANGCHAIN_PROJECT env vars to run tests.",
  );
}

const datasetName = process.env.LANGSMITH_TEST_DATASET_NAME;

test(`"Test run on ${datasetName}`, async () => {
  const client = new Client();
  const examples: Example[] = [];

  for await (const example of client.listExamples({ datasetName })) {
    examples.push(example);
  }

  const userType: UserType = await select({
    message: "Select user type for test run",
    choices: [
      { name: "Patient", value: <UserType>"patient" },
      { name: "Doctor", value: <UserType>"doctor" },
    ],
  });

  //use this to distinguish between different chunk sizes, models, etc.
  // const specifyUsedVariables = await confirm({
  //   message:
  //     "Use custom description for Variables (chunk sizes, models etc.) ? 'No' will use the values from env vars",
  // });

  let usedVariables =
    "_p=" +
    process.env.LANGCHAIN_PROJECT +
    "_cs=" +
    process.env.CHUNK_SIZE +
    "_co=" +
    process.env.CHUNK_OVERLAP +
    "_m=" +
    process.env.OPENAI_MODEL_NAME;

  // if (specifyUsedVariables) {
  //   usedVariables = await input({ message: "Enter project name" });
  // }

  const projectNameWithDate =
    "u=" +
    userType +
    usedVariables +
    "_t=" +
    new Date().toISOString().replace("T", "_").substring(2, 16);

  const dataSet = await client.readDataset({ datasetName: datasetName });
  const project = await client.createProject({
    projectName: projectNameWithDate,
    referenceDatasetId: dataSet.id,
  });

  const configs = getConfigs(examples, project.name);
  const chainInputs = examples.map((example) => example.inputs);

  const limit = pLimit(10); // Limit concurrency to 10
  try {
    console.log("Running tests, this might take a while...");
    const chains = chainInputs.map((input, index) =>
      limit(async () => {
        //create new chain for each input with empty history and streaming set to false
        const chain = await ChainFactory.create([], false, userType);
        return chain.invoke(input, configs[index]);
      }),
    );

    await Promise.allSettled(chains);
  } catch (error) {
    console.log("Error running tests");
    console.log(error);
  }
}, 300_000); // 300 seconds timeout to allow for long running tests might need to be increased
