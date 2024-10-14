import { connectMongoDB } from "../../lib/mongodb";

let isConnected = false;

export async function dbConnect() {
    if (!isConnected) {
        await connectMongoDB();
        isConnected = true;
        console.log('Connected to MongoDB');
    }
}
