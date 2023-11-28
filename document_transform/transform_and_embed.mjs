import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { VercelPostgres } from "langchain/vectorstores/vercel_postgres";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import 'dotenv/config'


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

// Define the text splitter. Here we can play around with the chunk size and overlap
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 30,
});

// Define the necessary things for the database
const embeddings = new OpenAIEmbeddings();


// Split the documents into chunks
const chunkedDocuments = await textSplitter.splitDocuments(documents);
console.log(`Created ${chunkedDocuments.length} chunks`);

// Embed the chunks and store them in the database. The database will be created if it does not exist
VercelPostgres.fromDocuments(chunkedDocuments, embeddings, {
  tableName: "urticaria_pdfs_cs512",
});

console.log("Embedding done.");
