import os

from dotenv import load_dotenv

from langchain.vectorstores.pgvector import PGVector
from langchain.embeddings.openai import OpenAIEmbeddings

load_dotenv('.env.development.local')

embeddings = OpenAIEmbeddings()
CONNECTION_STRING = PGVector.connection_string_from_db_params(
    driver=os.environ.get("POSTGRES_DRIVER", "psycopg2"),
    host=os.environ.get("POSTGRES_HOST", "localhost"),
    port=int(os.environ.get("PGVECTOR_PORT", "5432")),
    database=os.environ.get("POSTGRES_DATABASE", "postgres"),
    user=os.environ.get("POSTGRES_USER", "postgres"),
    password=os.environ.get("POSTGRES_PASSWORD", "postgres"),
)

db = PGVector(
    connection_string=CONNECTION_STRING,
    embedding_function=embeddings,
)

# Search for similar documents in the database
docs_with_score = db.similarity_search_with_score("Urticaria")
print(docs_with_score[0])



