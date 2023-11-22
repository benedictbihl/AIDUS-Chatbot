import os

from dotenv import load_dotenv

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import DirectoryLoader
from langchain.document_loaders import PyMuPDFLoader
from langchain.vectorstores.pgvector import PGVector
from langchain.embeddings.openai import OpenAIEmbeddings

load_dotenv('.env.development.local')

# Define the folder where the pdfs are located
root_folder = os.getenv("ROOT_DIR") or ""
print("Root folder: ", root_folder)

# Load the pdfs using the PyMuPDFLoader. Returns a list of Document objects with the pdf content and metadata
loader = DirectoryLoader(root_folder, glob="**/*.pdf", loader_cls=PyMuPDFLoader)
documents = loader.load()
print("Loaded {} Pages".format(len(documents)))

# Define the text splitter. Here we can play around with the chunk size and overlap
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size = 500,
    chunk_overlap  = 40,
    length_function = len,
    is_separator_regex = False,
)

# Define the necessary things for the database
embeddings = OpenAIEmbeddings()
CONNECTION_STRING = PGVector.connection_string_from_db_params(
    driver=os.environ.get("POSTGRES_DRIVER", "psycopg2"),
    host=os.environ.get("POSTGRES_HOST", "localhost"),
    port=int(os.environ.get("PGVECTOR_PORT", "5432")),
    database=os.environ.get("POSTGRES_DATABASE", "postgres"),
    user=os.environ.get("POSTGRES_USER", "postgres"),
    password=os.environ.get("POSTGRES_PASSWORD", "postgres"),
)
COLLECTION_NAME ="urticaria_pdfs"

# Split the documents into chunks
chunked_documents = text_splitter.split_documents(documents)
print("Created {} chunks".format(len(chunked_documents)))

# Embed the chunks and store them in the database. The database will be created if it does not exist
db = PGVector.from_documents(
    documents=chunked_documents,
    embedding=embeddings,
    connection_string=CONNECTION_STRING,
    collection_name=COLLECTION_NAME,
    pre_delete_collection=True,
)

print("Embedding done.")


