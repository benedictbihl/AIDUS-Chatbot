# AIDUS: An AI-driven Urticaria Support System

This repo contains an AI-driven chatbot (AIDUS) built with [LangChain](https://js.langchain.com), [OpenAI](https://openai.com), and [Next.js](https://nextjs.org). Utilizing RAG (Retrieval-Augmented Generation), AIDUS is able to answer questions about urticaria and provide relevant information to users based on many scientific papers and articles.

## Running AIDUS Locally

To run this project locally, you will need to have an [OpenAI](https://openai.com) account. You will also need to have a database containing the embeddings of the scientific papers and articles that AIDUS uses to answer questions. This database can be hosted on [Vercel](https://vercel.com) (like we are doing with postgres) or elsewhere. Refer to langchain's [documentation](https://js.langchain.com/docs) for more information on how to create the database and populate it with embeddings.

To get started, clone this repo and install the dependencies:

```bash
npm install
```

Then, set the required environment variables as found in the `.env.local.example` file:

```bash
OPENAI_API_KEY= # Can be found in your OpenAI account
OPENAI_ORGANIZATION= #OPTIONAL, can be found in your OpenAI account

# POSTGRES stuff to connect to the database containing the the embeddings. Can be found in the Vercel dashboard
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

EMBEDDINGS_TABLE_NAME= #name of the table containing the embeddings
OPEN_AI_MODEL_NAME= #gpt-3.5-turbo-1106 or gpt-4

ROOT_DIR= #OPTIONAL, used for PDF ingestion - absolute path to the directory where the PDFs are stored

LANGSMITH_TEST_DATASET_NAME= #OPTIONAL, contains the test questions needed to run the test suite
LANGCHAIN_API_KEY= #OPTIONAL, can be found in your Langsmith account
LANGCHAIN_ENDPOINT= #OPTIONAL, can be found in your Langsmith account
LANGCHAIN_PROJECT= #OPTIONAL, can be found in your Langsmith account
LANGCHAIN_TRACING_V2= #OPTIONAL, can be found in your Langsmith account
```

Next, you will need to create your embeddings. Refer to [`util/transform_documents/transform_and_embed.mjs`](util/transform_documents/transform_and_embed.mjs). Here we load a bunch of PDFs and transform them into embedding, storing them in a database. This is a one-time process that needs to be done before running the app by running:

```bash
npm run embed
```

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

Next.js apps generally work best when deployed to the [Vercel Platform](https://vercel.com). However, you can deploy this project anywhere that supports Node.js.

## Testing

Langsmith provides a fantastic platform to structurally evaluate LLM-based apps. In [`app/langchain/chain.test.ts`](app/langchain/chain.test.ts) you can see an implementation of how to run AIDUS programmatically and evaluate it against a test dataset. Refer to the [Langsmith documentation](https://docs.smith.langchain.com/) for more information on testing and evaluation.

After setting up a langsmith account, creating a test dataset and setting the required environment variables, you can run the test suite:

```bash
npm run test
```

## More Information

To learn more about LangChain, OpenAI, Next.js, and the Vercel AI SDK take a look at the following resources:

- [Vercel AI SDK docs](https://sdk.vercel.ai/docs) - learn mode about the Vercel AI SDK
- [LangChain Documentation](https://js.langchain.com/docs) - learn about LangChain
- [Langsmith documentation](https://docs.smith.langchain.com/) - learn about Langsmith
- [OpenAI Documentation](https://platform.openai.com/docs) - learn about OpenAI features and API.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

## Addendum: The variables that influence the performance of AIDUS

- The quality of the embeddings: Experiment with different chunk sizes, overlaps and possibly entirely different strategies like [HyDE](https://arxiv.org/abs/2212.10496). The embeddings are the foundation of the entire system, so it is important to get them right. Do this in [`util/transform_documents/transform_and_embed.mjs`](util/transform_documents/transform_and_embed.mjs).
- The custom instructions we give to the model: Experiment with different instructions. The instructions are the second most important part of the system. Do this in [`app/langchain/chain.ts`](app/langchain/chain.ts).
- The used model: You can switch between gpt-3.5-turbo-1106 and gpt-4 by setting the `OPEN_AI_MODEL_NAME` environment variable. The former is faster and cheaper, but the latter is more accurate.
