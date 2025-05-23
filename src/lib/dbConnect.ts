import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {
  // Prevent redundant connections
  if (connection.isConnected) {
    console.log("✅ MongoDB already connected.");
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in environment variables.");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    connection.isConnected = db.connection.readyState;

    if (connection.isConnected === 1) {
      console.log("✅ MongoDB connected successfully.");
    } else {
      console.log("⚠️ MongoDB connection status:", db.connection.readyState);           
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("MongoDB connection failed.");
  }
}

export default dbConnect;