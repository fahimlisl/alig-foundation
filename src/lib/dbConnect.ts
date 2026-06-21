import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
    throw new Error("Please define the MONGO_URI environment variable");
}

let cached = (global as any).mongooseConnection;

if (!cached) {
    cached = (global as any).mongooseConnection = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
    // already connected — reuse it, no new connection attempt
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGO_URI, {
                bufferCommands: false,
            })
            .then((mongooseInstance) => {
                console.log("db connected successfully");
                return mongooseInstance;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null; // allow retry on next call instead of staying stuck on a failed promise
        console.error("database connection failed", error);
        throw error; // let the calling route's try/catch handle this, never process.exit() here
    }

    return cached.conn;
}

export default dbConnect;