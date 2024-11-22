import mongoose from "mongoose";

const MONGO_DB_URI = process.env.DATABASE_URL || "mongodb+srv://test:test@teams.umrqwep.mongodb.net/?retryWrites=true&w=majority";
const MONGO_DB_DATABASE_NAME = "hirekarigar";
const cached: { connection?: typeof mongoose; promise?: Promise<typeof mongoose> } = {};

async function connectMongo() {
  if (!MONGO_DB_URI) {
    throw new Error("Please define the MONGO_URI environment variable inside .env.local");
  }
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGO_DB_DATABASE_NAME,
    };
    cached.promise = mongoose.connect(MONGO_DB_URI, opts);
  }
  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }
  return cached.connection;
}
export default connectMongo;
