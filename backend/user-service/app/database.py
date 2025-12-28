import os
import time
from pymongo import MongoClient

MONGO_USER = os.getenv("MONGO_USER_INITDB_ROOT_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_USER_INITDB_ROOT_PASSWORD")
MONGO_HOST = os.getenv("MONGO_USER_HOST")
MONGO_DB = os.getenv("MONGO_USER_DB")
MONGO_PORT = os.getenv("MONGO_USER_PORT")
MONGO_URL = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_DB}?authSource=admin"

print(f"Connecting to MongoDB at: {MONGO_URL.replace(os.getenv('MONGO_USER_INITDB_ROOT_PASSWORD'), '****')}")

def get_database(retries: int = 20, delay: int = 3):
    for attempt in range(retries):
        try:
            print(f"Connecting to MongoDB (attempt {attempt + 1})...")
            client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
            client.admin.command("ping")

            db = client[MONGO_USER]
            db.user_profiles.create_index("user_id", unique=True)
            print("✅ Connected to MongoDB and index created")

            return db

        except Exception as e:
            print(f"⚠️  Mongo not ready: {e}")
            time.sleep(delay)

    raise RuntimeError("❌ Could not connect to MongoDB after several attempts.")

database = get_database()
user_profiles = database.user_profiles
