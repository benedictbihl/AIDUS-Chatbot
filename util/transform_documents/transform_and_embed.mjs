import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { VercelPostgres } from "langchain/vectorstores/vercel_postgres";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import "dotenv/config";
import { input } from "@inquirer/prompts";

if (
  !process.env.CHUNK_SIZE ||
  !process.env.CHUNK_OVERLAP ||
  !process.env.ROOT_DIR
) {
  throw new Error(
    "Please provide the following environment variables: CHUNK_SIZE, CHUNK_OVERLAP, ROOT_DIR",
  );
}

// Define the folder where the pdfs are located
const rootFolder = process.env.ROOT_DIR || "";
console.log("Root folder: ", rootFolder);

// Load the pdfs. Returns a list of Document objects with the pdf content and metadata
const loader = new DirectoryLoader(rootFolder, {
  ".pdf": (path) => new PDFLoader(path),
});
const documents = await loader.load();
console.log(`Loaded ${documents.length} Pages`);

//remove file_path and source from metadata
documents.forEach((doc) => {
  delete doc.metadata.file_path;
  delete doc.metadata.source;
});

console.log(process.env.CHUNK_SIZE, process.env.CHUNK_OVERLAP);
// Define the text splitter. Here we can play around with the chunk size and overlap
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: Number(process.env.CHUNK_SIZE),
  chunkOverlap: Number(process.env.CHUNK_OVERLAP),
});

// Define the necessary things for the database
const embeddings = new OpenAIEmbeddings();

// Split the documents into chunks
const chunkedDocuments = await textSplitter.splitDocuments(documents);
console.log(`Created ${chunkedDocuments.length} chunks`);

const tableName = await input({
  message:
    "Enter the name of the table where the embeddings should be stored. Should be unique as to not overwrite existing data.",
});

// Embed the chunks and store them in the database. The database will be created if it does not exist
VercelPostgres.fromDocuments(chunkedDocuments, embeddings, {
  tableName,
});

console.log("Embedding done.");
